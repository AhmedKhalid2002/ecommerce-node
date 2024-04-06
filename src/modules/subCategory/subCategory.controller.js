import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from '../../utils/cloud.js'
import {subCategory} from '../../../DB/model/subCategory.model.js'
import slugify from "slugify";
import { Category } from "../../../DB/model/category.model.js";

export const createSubCategory=asyncHandler(async(req,res,next)=>{
    const {categoryId}=req.params
    const category=await Category.findOne({_id:categoryId})
    if(!category)
        return next(new Error("category not exist"))

    if(!req.file)
        return next(new Error("subCategory image is required",{cause:400}));

    const {public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.CLOUD_FOLDER_NAME}/subcategory`
    })

    await subCategory.create({
        name:req.body.name,
        slug: slugify(req.body.name),
        createdBy:req.user.id,
        image:{id:public_id,url:secure_url},
        categoryId:categoryId
    })

    return res.json({
        success:true,
        message:"subcategory created successfully!"
    })
})

export const updateSubCategory=asyncHandler(async(req,res,next)=>{
    
    const category=await Category.findById(req.params.categoryId);
    if(!category) return next(new Error("Category not found",{cause:404}));

    const subcategory=await subCategory.findOne({_id:req.params.id,categoryId:req.params.categoryId})
    if(!subcategory) return next(new Error("subCategory not found",{cause:404}));

    
    if(req.user.id.toString() !== subcategory.createdBy.toString())
        return next(new Error("Not allowed updated the subcategory"));

    if(req.file){
        const {public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{
            public_id:subcategory.image.id
        });
        subcategory.image={id:public_id,url:secure_url}
    }

    subcategory.name=req.body.name?req.body.name:subcategory.name;
    subcategory.slug=req.body.name?slugify(req.body.name):subcategory.slug;

    await subcategory.save();
    return res.json({
        success:true,
        message:"subcategory updated successfully"
    })
})

export const deleteSubCategory=asyncHandler(async (req,res,next)=>{
    const category=await Category.findById(req.params.categoryId);
    if(!category)
        return next(new Error("Category not found",{cause:404}));

    const subcategory=await subCategory.findOne({_id:req.params.id,categoryId:req.params.categoryId})
    if(!subcategory) return next(new Error("subCategory not found",{cause:404}));
    

    if(req.user.id.toString() !== subcategory.createdBy.toString())
            return next(new Error("Not allowed deleted subcategory"))

    await subCategory.findByIdAndDelete(req.params.id);

    await cloudinary.uploader.destroy(subcategory.image.id);

    return res.json({
        success:true,
        message:"subCategory deleted successfully"
    })
})

export const allSubCategory=asyncHandler(async(req,res,next)=>{
    const result=await subCategory.find();

    return res.json({
        success:true,
        category:result
    })
})