export const isAuthorized=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))return next(new Error("Not Authorized!",{cause:403}))
        return next()
    }
}