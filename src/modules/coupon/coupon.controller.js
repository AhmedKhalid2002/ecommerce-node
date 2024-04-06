import { asyncHandler } from "../../utils/asyncHandler.js";
import voucher_code from 'voucher-code-generator'
import {Coupon} from '../../../DB/model/coupon.model.js'

export const createCoupon=asyncHandler(async(req,res,next)=>{
    // generate code
    const code=voucher_code.generate({length:5});
    // save coupon in database
    const coupon =await Coupon.create({
        name:code[0],
        createdBy:req.user.id,
        discount:req.body.discount,
        expiredAt:new Date(req.body.expiredAt).getTime()
    })
    // response
    return res.status(201).json({
        success:true,
        results:{coupon}
    })
})

export const updateCoupon=asyncHandler(async(req,res,next)=>{
    const coupon=await Coupon.findOne({name:req.params.code,expiredAt:{$gt:Date.now()}})
    if(!coupon)
        return next(new Error("Invalid Coupon",{cause:404}))

    if(req.user.id.toString() != coupon.createdBy.toString())
        return next(new Error("Not Authorized",{cause:403}));

    coupon.discount=req.body.discount?req.body.discount:coupon.discount;
    coupon.expiredAt=req.body.expiredAt?new Date(req.body.expiredAt).getTime():coupon.expiredAt;
    await coupon.save();

    return res.json({
        success:true,
        message:"Coupon updated successfully"
    })
})

export const deleteCoupon=asyncHandler(async(req,res,next)=>{
    const coupon=await Coupon.findById(req.params.id)
    if(!coupon)
        return next(new Error("Invalid Coupon",{cause:404}))

    if(req.user.id.toString() != coupon.createdBy.toString())
        return next(new Error("Not Authorized",{cause:403}));

    await coupon.deleteOne();

    return res.json({
        success:true,
        message:"Coupon deleted successfully"
    })
})

export const allCoupons=asyncHandler(async(req,res,next)=>{
    // admin >>> all coupon
    if(req.user.role == "admin"){
        const coupons =await Coupon.find();
        return res.json({
            success:true,
            coupons,
        })
    }
    // seller >>> his coupon
    const coupons =await Coupon.find({createdBy:req.user.id});
        return res.json({
            success:true,
            coupons,
        })
})