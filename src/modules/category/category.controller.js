import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from '../../utils/cloud.js'
import {Category} from '../../../DB/model/category.model.js'
import slugify from "slugify";

export const createCategory=asyncHandler(async(req,res,next)=>{
    if(!req.file)
        return next(new Error("Category image is required",{cause:400}));

    const {public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.CLOUD_FOLDER_NAME}/category`
    })

    await Category.create({
        name:req.body.name,
        slug: slugify(req.body.name),
        createdBy:req.user.id,
        image:{id:public_id,url:secure_url}
    })

    return res.json({
        success:true,
        message:"category created successfully!"
    })
})

export const updateCategory=asyncHandler(async(req,res,next)=>{
    const category=await Category.findById(req.params.id);

    if(!category) return next(new Error("Category not found",{cause:404}));

    if(req.user.id.toString() !== category.createdBy.toString())
        return next(new Error("Not allowed updated the category"));

    if(req.file){
        const {public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{
            public_id:category.image.id
        });
        category.image={id:public_id,url:secure_url}
    }

    category.name=req.body.name?req.body.name:category.name;
    category.slug=req.body.name?slugify(req.body.name):category.slug;
    await category.save();
    return res.json({
        success:true,
        message:"category updated successfully"
    })
})

export const deleteCategory=asyncHandler(async (req,res,next)=>{
    const {id}=req.params;
    const category=await Category.findById(id);

    if(!category)
        return next(new Error("Category not found",{cause:404}));

    if(req.user.id.toString() !== category.createdBy.toString())
            return next(new Error("Not allowed deleted category"))

    await Category.findByIdAndDelete(id);

    await cloudinary.uploader.destroy(category.image.id);

    return res.json({
        success:true,
        message:"Category deleted successfully"
    })
})

export const allCategory=asyncHandler(async(req,res,next)=>{
    const result=await Category.find().populate("subCategory");

    return res.json({
        success:true,
        category:result
    })
})