import Joi from "joi"
import { validObjectId } from "../../middleware/validation.js"


export const createSubCategorySchema=Joi.object({
    name:Joi.string().min(5).max(20).required(),
    categoryId:Joi.string().custom(validObjectId).required()
}).required();


export const updateSubCategorySchema=Joi.object({
    name:Joi.string().min(4).max(20),
    categoryId:Joi.string().custom(validObjectId).required(),
    id:Joi.string().custom(validObjectId).required()
})

export const deleteSubCategorySchema=Joi.object({
    categoryId:Joi.string().custom(validObjectId).required(),
    id:Joi.string().custom(validObjectId).required()
})
