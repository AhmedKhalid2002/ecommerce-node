import { Cart } from "../../../DB/model/cart.model.js";
import { Product } from "../../../DB/model/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addCart=asyncHandler(async (req,res,next)=>{
    const {productId,quantity}=req.body;

    // check product 
    const product =await Product.findById(productId);
    if(!product)
        return next(new Error("product not found"));

    if(!product.inStock (quantity))
        return next(new Error(`Sorry,only ${product.avaliableItems} items are available`));
    

    // check product exsitence in the cart
    const isProductInCart=await Cart.findOne({
        user:req.user.id,
        "prouct.productId":productId
    });
    if(isProductInCart){
        const theProduct = isProductInCart.prouct.find(
            (prod)=>prod.productId.toString()=== productId.toString()
        );
        if(product.inStock(theProduct.quantity + quantity)){
            theProduct.quantity=theProduct.quantity+quantity;
            await isProductInCart.save();
            return res.json({
                success:true,
                results:{
                    cart:isProductInCart,
                }
            })
        }else{
            return next(new Error(`sorry,only ${product.avaliableItems} items are available`))
        }
    }
    const cart =await Cart.findOneAndUpdate({
        user:req.user._id
    },{$push:{prouct:{productId,quantity}}},
    {new:true}
    );

    return res.json({
        success:true,
        message:"Product added successfully",
        cart
    })
})

export const userCart=asyncHandler(async (req,res,next)=>{
    
    if(req.user.role == "user"){
        const cart = await Cart.findOne({user:req.user.id});
        return res.json({
            success:true,
            cart
        })
    }
    if(req.user.role == "admin" && !req.body.cartId)
        return next(new Error("Cart Id is required"));

    const cart = await Cart.findById(req.body.cartId);
    return res.json({
        success:true,
        cart
    })
})

export const updateCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    
    const cart = await Cart.findOneAndUpdate(
        {
            user: req.user.id,
            "prouct.productId": productId
        },{ 
            "prouct.$.quantity": quantity
        },
        { new: true }
    );

    return res.json({
        success: true,
        cart
    });
});


export const deleteCart=asyncHandler(async(req,res,next)=>{
    const {productId}=req.body

    const product=await Product.findById(productId);
    if(!product)
        return next(new Error("Product not found"))

    const cart =await Cart.findOneAndUpdate(
        {user:req.user.id},
        {$pull:{prouct:{productId}}},
        {new:true}
    )

    return res.json({
        success:true,
        cart
    })
})

export const clearCart=asyncHandler(async(req,res,next)=>{

    const cart=await Cart.findOneAndUpdate(
        {user:req.user.id},
        {prouct:[]},
        {new:true}
        )
        return res.json({
            success:true,
            message:"clear cart successfully",
            cart
        })
})