import { Schema, Types, model } from "mongoose";

const cartSchema=new Schema({
    prouct:[{
        productId:{type:Types.ObjectId,ref:"Product"},
        quantity:{type:Number,default:1},
    }],
    user:{type:Types.ObjectId,ref:"User",required:true,unique:true}
},{
    timestamps:true,
    
});

export const Cart=model("Cart",cartSchema);