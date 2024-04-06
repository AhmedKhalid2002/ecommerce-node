import { Category } from "../../../DB/model/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import {Brand} from '../../../DB/model/brand.model.js'
import slugify from "slugify";

export const createBrand=asyncHandler(async (req,res,next)=>{
    // check categories
    const {categories,name}=req.body;

    categories.forEach(async(categoryId) => {
        const category=await Category.findById(categoryId);
        if(!category)
            return next(new Error(`Category ${categoryId} not found!`,{cause:404}))
    });

    // file
    if(!req.file)
        return next(new Error("Brand image is required",{cause:404}))

    const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.CLOUD_FOLDER_NAME}/brands`
    })

    const brand= await Brand.create({
        name,
        createdBy:req.user.id,
        slug:slugify(name),
        image:{url:secure_url,id:public_id},
    })
    
    categories.forEach(async (categoryId)=>{
        const category= await Category.findById(categoryId);
        category.brands.push(brand._id);
        await category.save();
    })
    return res.json({
        success:true,
        message:"Brand created successfully"
    })
})

export const updateBrand=asyncHandler(async(req,res,next)=>{
    const brand =await Brand.findById(req.params.id);
    if(!brand)
        return next(new Error("Brand not found"));

    if(req.file){
        const {secure_url,public_id}=await cloudinary.uploader.upload(brand.image.id);
        brand.image={url:secure_url,id:public_id};
    }
    brand.name=req.body.name?req.body.name:brand.name;
    brand.slug=req.body.name?slugify(req.body.name):brand.slug;
    await brand.save();
    return res.json({
        success:true,
        message:"Brand updated successfully"
    })
})
export const deleteBrand=asyncHandler(async(req,res,next)=>{
    const brand =await Brand.findByIdAndDelete(req.params.id);
    if(!brand)
        return next(new Error("Brand not found"));
    // delete image
    await cloudinary.uploader.destroy(brand.image.id);
    // delete brand from categories
    await Category.updateMany({},{$pull:{brands:brand._id}});
    
    return res.json({
        success:true,
        message:"Brand Deleted successfully",
    })
    
})

export const allBrand=asyncHandler(async(req,res,next)=>{
    const brands=await Brand.find()
    return res.json({
        success:true,
        brands,
    })
})