import Joi from "joi";
import { validObjectId } from "../../middleware/validation.js";

export const addCartSchema=Joi.object({
    productId:Joi.string().custom(validObjectId).required(),
    quantity:Joi.number().integer().min(1).required()
}).required()

export const userCartSchema=Joi.object({
    cartId:Joi.string().custom(validObjectId),
}).required()

export const updateCartSchema=Joi.object({
    productId:Joi.string().custom(validObjectId).required(),
    quantity:Joi.number().integer().min(1).required()
}).required()

export const deleteCartSchema=Joi.object({
    productId:Joi.string().custom(validObjectId).required(),
}).required()

