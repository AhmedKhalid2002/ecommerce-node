import { nanoid } from "nanoid";
import { Brand } from "../../../DB/model/brand.model.js";
import { Category } from "../../../DB/model/category.model.js";
import { Product } from "../../../DB/model/product.model.js";
import { subCategory } from "../../../DB/model/subCategory.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

export const createProduct=asyncHandler(async(req,res,next)=>{

    const category=await Category.findById(req.body.category);
    if(!category)
        return next(new Error("Category not found"))

    const subcategory=await subCategory.findById(req.body.subcategory);
    if(!subcategory)
        return next(new Error("subcategory not found"))

    const brand=await Brand.findById(req.body.brand);
    if(!brand)
        return next(new Error("Brand not found"))

    if(!req.files){
        return next(new Error("product images are required"))
    }
    // create Folder name
    const cloudFolder=nanoid();
    let images=[];
    // upload sub images
    for(const file of req.files.subImage){
        const {secure_url,public_id}=await cloudinary.uploader.upload(file.path,{folder:`${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}`})
        images.push({id:public_id,url:secure_url})
    }
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.defaultImage[0].path,{folder:`${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}`})

    const product =await Product.create({
        ...req.body,
        cloudFolder,
        createdBy:req.user.id,
        defaultImage:{url:secure_url,id:public_id},
        images,
    })

    return res.json({
        success:true,
        message:"Product created successfully"
    })
})

export const deleteProduct=asyncHandler(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product)
        return next(new Error("Product not found",{cause:404}));

    if(req.user.id.toString() != product.createdBy.toString())
        return next(new Error("Not Authorizes",{cause:401}));

    await Product.deleteOne();

    // delte images
    const ids=product.images.map((image)=>image.id);
    ids.push(product.defaultImage.id)
    await cloudinary.api.delete_all_resources(ids);

    // delete folder
    await cloudinary.api.delete_folder(`${process.env.CLOUD_FOLDER_NAME}/products/${product.cloudFolder}`)

    return res.json({
        success:true,
        message:"Product deleted successfully"
    })
})

export const allProduct=asyncHandler(async (req,res,next)=>{
    const {page,sort,keyWord,category,brand,subcategory}=req.query;
    if(category && !(await Category.findById(category)))
        return next(new Error("Category not found",{cause:404}));

    if(subcategory && !(await subCategory.findById(subcategory)))
        return next(new Error("subcategory not found",{cause:404}));

    if(brand && !(await Brand.findById(brand)))
        return next(new Error("Brand not found",{cause:404}));
    
    const products=await Product.find({...req.query}).sort(sort).paginate(page).search(keyWord)

    return res.json({
        success:true,
        products,
    })
}) 