import { User } from "../../../DB/model/user.model.js";
import {Token} from "../../../DB/model/token.model.js";
import {Cart} from "../../../DB/model/cart.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {sendEmail} from '../../utils/sendEmail.js'
import {resetPassTemp, signUpTemp} from '../../utils/htmlTempletes.js'
import randomstring from 'randomstring'

export const signup=asyncHandler(async(req,res,next)=>{

    // * request data
    const {email}=req.body;

    // * check user
    const user=await User.findOne({email})
    if(user)
        return next(new Error("User already existed!",{cause:400}));

   
    // * generate token
    const token = jwt.sign({email},process.env.SECRET_KEY)

    // * create user
    await User.create({...req.body})
    // * create confirm link
    const confirmLink=`http://localhost:3000/auth/active_account/${token}`;

    // * send email
    const messageSend=await sendEmail({
        to:email,
        subject:"Activation account",
        html:signUpTemp(confirmLink)
    })
    if(!messageSend)
        return next(new Error("somting went wrong "))

    return res.json({
        success:true,
        message:"Check your email"
    })
})

// ^ activate account
export const activateAcount=asyncHandler(async(req,res,next)=>{
    const {token}=req.params;
    
    const {email}=jwt.verify(token,process.env.SECRET_KEY)

    const user=await User.findOneAndUpdate({email},{isConfirmed:true});

    if(!user)
        return next(new Error("User not found",{cause:404}))

    //^ create cart
    await Cart.create({user:user._id})

    return res.send("Try login now!")
})

// ^ login
export const login=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;

    const user=await User.findOne({email});

    if(!user)
        return next(new Error("Invalid email"));

    const match=bcryptjs.compareSync(password,user.password);
    if(!match)
        return next(new Error("Invalid Password"))

    const validEmail=await User.findOne({isConfirmed:true});
    if(!validEmail)
        return next(new Error("You should active acount!"))

    const token=jwt.sign({email:user.email,id:user._id},process.env.SECRET_KEY);
    await Token.create({
        token,
        user:user._id,
    }) 
    return res.json({
        success:true,
        message:"you can login now",
        token,
    })
})

//^ send forget Code
export const sendCode=asyncHandler(async(req,res,next)=>{
    const {email}=req.body;

    const user=await User.findOne({email});
    if(!user)
        return next(new Error("User not found",{cause:404}));

    const forgetCode=randomstring.generate({
        length:5,
        charset:"numeric"
    })
    user.forgetCode=forgetCode;
    await user.save();

    const codeMessage=await sendEmail({
        to:user.email,
        subject:"Reset password",
        html:resetPassTemp(forgetCode)
    })

    if(!codeMessage)
        return next(new Error("somting went wrong!"))

    return res.json({
        success:true,
        message:"Check your email"
    })
})

//^ reset password
export const resetPassword=asyncHandler(async(req,res,next)=>{
    const {email,password,forgetCode}=req.body;

    const user=await User.findOne({email});

    if(!user)
        return next(new Error("Invalid email"));

    if(forgetCode !=user.forgetCode)
            return next(new Error("Code is invalid"))

    user.password=bcryptjs.hashSync(password,parseInt(process.env.SALT_ROUND))
    await user.save();

    const tokens=await Token.find({user:user._id})
    tokens.forEach(async (token)=>{
        token.isValid=false;
        await token.save();
    });

    return res.json({
        success:true,
        message:"Try login now",
    })
})