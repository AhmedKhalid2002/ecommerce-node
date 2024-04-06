import { Schema, Types, model } from "mongoose";
import { subCategory } from "./subCategory.model.js";


const categorySchema=new Schema({
    name:{type:String,required:true,unique:true,min:5,max:20},
    slug:{type:String,required:true,unique:true},
    createdBy:{type:Types.ObjectId,ref:"User",required:true},
    image:{id:{type:String},url:{type:String}},
    brands:[{type:Types.ObjectId,ref:"Brand"}]
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
}
)
categorySchema.post("deleteOne",async function(){
    await subCategory.deleteMany({
        categoryId:this._id,
    })
})
categorySchema.virtual("subCategory",{
    ref:"subCategory",
    localField:"_id",
    foreignField:"categoryId"
})
export const Category=model("Category",categorySchema);