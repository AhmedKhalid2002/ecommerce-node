export const asyncHandler=(controller)=>{
    return (req,res,next)=>{
        controller(req,res,next).catch((error)=>next(error))
    }
}