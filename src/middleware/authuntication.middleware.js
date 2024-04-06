import { Token } from "../../DB/model/token.model.js";
import { User } from "../../DB/model/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
export const isAuthenticated=asyncHandler(async (req,res,next)=>{
    let {token}=req.headers;

    if(!token )
            return next(new Error("Token missing"));
    
    if(!token.startsWith(process.env.BERAR_TOKEN))
            return next(new Error("Invalid token"))
        
    token=token.split(process.env.BERAR_TOKEN)[1];

    const payload=jwt.verify(token,process.env.SECRET_KEY);

    const tokenDb=await Token.findOne({token,isValid:true});
    if(!tokenDb)
        return next(new Error("Token is invalid!"))

    const user=await User.findById(payload.id);
    if(!user)
        return next(new Error("User not found",{cause:404}));

    req.user=user

    return next()
})