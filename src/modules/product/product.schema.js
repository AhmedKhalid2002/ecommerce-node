import Joi from "joi";
import { validObjectId } from "../../middleware/validation.js";

export const createProductSchema=Joi.object({
    name:Joi.string().min(2).max(20).required(),
    description:Joi.string().min(10).max(20),
    avaliableItems:Joi.number().integer().min(1).required(),
    price:Joi.number().integer().min(1).required(),
    discount:Joi.number().min(1).max(100),
    category:Joi.string().custom(validObjectId).required(),
    subcategory:Joi.string().custom(validObjectId).required(),
    brand:Joi.string().custom(validObjectId).required(),

}).required();

export const deleteProductSchema=Joi.object({
    id:Joi.string().custom(validObjectId).required()
}).required();