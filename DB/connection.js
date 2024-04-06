import mongoose from "mongoose";


export const connectionDB=async()=>{
    return await mongoose.connect(process.env.CONNECTION_URL).then(()=>console.log("DB connected successfully")).catch(()=>console.log("faild to connect DB"))
}