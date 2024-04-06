import Joi from "joi";
import { validObjectId } from "../../middleware/validation.js";

export const createBrandSchema=Joi.object({
    name:Joi.string().min(2).max(12).required(),
    categories:Joi.array().items(Joi.string().custom(validObjectId).required()).required()
}).required();

export const updateBrandSchema=Joi.object({
    name:Joi.string().min(2).max(12),
    id:Joi.string().custom(validObjectId).required()
}).required();

export const deleteBrandSchema=Joi.object({
    id:Joi.string().custom(validObjectId).required()
})