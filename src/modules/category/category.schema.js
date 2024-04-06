import Joi from "joi"
import { validObjectId } from "../../middleware/validation.js"


export const createCategorySchema=Joi.object({
    name:Joi.string().min(4).max(20).required()
})


export const updateCategorySchema=Joi.object({
    name:Joi.string().min(4).max(20),
    id:Joi.string().custom(validObjectId).required()
})

export const deleteCategorySchema=Joi.object({
    id:Joi.string().custom(validObjectId).required()
})