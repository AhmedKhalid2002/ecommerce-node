import { Cart } from "../../../DB/model/cart.model.js";
import { Coupon } from "../../../DB/model/coupon.model.js";
import { Product } from "../../../DB/model/product.model.js";
import { Order } from "../../../DB/model/order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import createInvoice from "../../utils/pdfInvoice.js";
import cloudinary from "../../utils/cloud.js";
import path from 'path'
import {fileURLToPath} from 'url'
import { sendEmail } from "../../utils/sendEmail.js";
import { clearCart, updateStock } from "./order.services.js";
import Stripe from 'stripe'
const __direname=path.dirname(fileURLToPath(import.meta.url))

export const createOrder=asyncHandler(async (req,res,next)=>{
    const {payment,address,coupon,phone}=req.body;

    // check coupon
    let checkCoupon;
    if(coupon){
        checkCoupon=await Coupon.findOne({name:coupon,expiredAt:{$gt:Date.now()}})
    }

    if(!checkCoupon && coupon )
        return next(new Error("Invalid Coupon",{cause:400}))
    
    // get product from cart
    const cart =await Cart.findOne({user:req.user.id});
    const products=cart.prouct;

    if(products < 1)
        return next(new Error("Empty cart!"))

    // check product
    let orderProducts=[];
    let orderPrice=0;

    for (let i=0;i<products.length;i++){
        const product =await Product.findById(products[i].productId);
        
        if(!product) return next(new Error(`${products[i].productId} product not found `))
        
        if(!product.inStock(products[i].quantity)) return next(new Error(`Product out stock ${product.avaliableItems} are available`))

        orderProducts.push({
            name:product.name,
            quantity:products[i].quantity,
            itemPrice:product.finalPrice,
            totalPrice:product.finalPrice * products[i].quantity,
            productId:product._id
        })
        orderPrice+=product.finalPrice * products[i].quantity
    }
    // create order
    const order =await Order.create({
        user:req.user.id,
        address,
        phone,
        payment,
        products:orderProducts,
        price:orderPrice,
        coupon:{
            id:checkCoupon?._id,
            name:checkCoupon?.name,
            discount:checkCoupon?.discount,
        },
    })
    // creaet invoice
    
    const invoice = {
        shipping: {
          name: req.user.userName,
          address: order.address,
          country: "Egypt",
        },
        items:order.products,
        subtotal: order.price,
        paid: order.finalPrice,
        invoice_nr: order._id
      };
    
    const pdfPath=path.join(__direname,`./../../invoices/invoice_${order._id}.pdf`);
    createInvoice(invoice,pdfPath)

    // upload cloudinary
    const {secure_url,public_id}=await cloudinary.uploader.upload(pdfPath,{folder:`${process.env.CLOUD_FOLDER_NAME}/order/invoices`})
    
    // add invoice in the database 
    order.invoice={url:secure_url,id:public_id};
    await order.save();
    // send email to user
    const isSent=await sendEmail({
        to:req.user.email,
        subject:"Order Invoice",
        attachments:[{path:secure_url,contentType:"application/pdf"}]
    })
    if(!isSent) return next(new Error("Something went wrong!"))
    // update stock
    updateStock(order.products,true)
    // clear cart
    clearCart(req.user.id);

    // visa
    if(payment === "visa"){
        // stripe
        const stripe=new Stripe(process.env.STRIPE_KEY);
        // coupon
        let couponExisted
        if(order.coupon.name !== undefined){
            couponExisted=await stripe.coupons.create({
                percent_off:order.coupon.discount,
                duration:"once"
            })
        }
        const session=await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            mode:"payment",
            success_url:process.env.SUCCESS_URL,
            cancel_url:process.env.CANCEL_URL,
            line_items:order.products.map((prod)=>{
                return {
                    price_data:{
                        currency:"egp",
                        product_data:{
                            name:prod.name,
                            // images:[prod.productId.defaultImage.url]
                        },
                        unit_amount:prod.itemPrice * 100,
                    },
                    quantity:prod.quantity,
                };
            }),
            discounts:couponExisted?[{coupon:couponExisted.id ,}]:[]
        });
        return res.status(201).json({
            success:true,
            results:{url:session.url},
            message:"Thanks for order, check your email"
        })
    }
    
    return res.json({
        success:true,
        results:{order}
    })
})

export const cancelOrder=asyncHandler(async (req,res,next)=>{
    const {id}=req.params;

    // ^ check order
    const order=await Order.findById(id);
    if(!order)
        return next(new Error("Order not found"));

    // ^ check status
    if(order.status == "delivered" || order.status == "shipped"||order.status == "canceled")
        return next(new Error("Sorry, can not cancel the order"))

    order.status="canceled";
    await order.save();

    // update stock
    updateStock(order.products,false);

    return res.json({
        success:true,
        message:"Order canceled!"
    })

})