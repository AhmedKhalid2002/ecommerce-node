import Joi from "joi";
import { validObjectId } from "../../middleware/validation.js";


export const addReview=Joi.object({
    productId:Joi.string().custom(validObjectId).required(),
    comment:Joi.string().required(),
    rating:Joi.number().min(1).max(5).required()
}).required();

export const updateReview=Joi.object({
    id:Joi.string().custom(validObjectId).required(),
    productId:Joi.string().custom(validObjectId).required(),
    comment:Joi.string(),
    rating:Joi.number().min(1).max(5),
}).required()