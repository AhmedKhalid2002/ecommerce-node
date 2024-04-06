import { Schema, Types, model } from "mongoose";


const subCategorySchema=new Schema({
    name:{type:String,required:true,unique:true,min:5,max:20},
    slug:{type:String,required:true,unique:true},
    createdBy:{type:Types.ObjectId,ref:"User",required:true},
    image:{id:{type:String},url:{type:String}},
    categoryId:{type:Types.ObjectId,ref:"Category",required:true},
    brands:[{type:Types.ObjectId,ref:"Brand"}]

},{timestamps:true})

export const subCategory=model("subCategory",subCategorySchema);