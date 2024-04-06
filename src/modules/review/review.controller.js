import { Order } from "../../../DB/model/order.model.js";
import { Product } from "../../../DB/model/product.model.js";
import { Review } from "../../../DB/model/review.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


export const addReview=asyncHandler(async(req,res,next)=>{
    const {productId}=req.params;
    const {comment,rating}=req.body;

    //^ check product in order
    const order=await Order.findOne({
        user:req.user.id,
        status:"delivered",
        "products.productId":productId,
    })

    if(!order)
        return next(new Error("Can not review this product!",{cause:400}))

    //^ check past review
    if(await Review.findOne({createdBy:req.user.id,productId,order:order._id}) )
        return next(new Error("Already review by you!"));

    const review=await Review.create({
        comment,
        rating,
        createdBy:req.user.id,
        order:order._id,
        productId,
    })
    // calculate average rate
    let calcRating=0;
    const product=await Product.findById(productId);
    const reviews=await Review.find({productId});

    for(let i=0;i<reviews.length;i++){
        calcRating+=reviews[i].rating;
    }
    product.averageRate=calcRating/reviews.length;

    await product.save()
    return res.json({
        success:true,
        results:{review}
    })
})

export const updateReview=asyncHandler(async(req,res,next)=>{
    const {id,productId}=req.params;
    const {comment,rating}=req.body;

    await Review.updateOne({_id:id,productId},{comment,rating});
   if(rating){
        let calcRating=0;
        const product=await Product.findById(productId);
        const reviews=await Review.find({productId});

        for(let i=0;i<reviews.length;i++){
            calcRating+=reviews[i].rating;
        }
        product.averageRate=calcRating/reviews.length;

        await product.save()
   }
    return res.json({
        success:true,
        message:"Reveiew updated successfully",
    })
})