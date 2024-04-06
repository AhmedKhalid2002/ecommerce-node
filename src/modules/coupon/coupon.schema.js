import Joi from "joi"
import { validObjectId } from "../../middleware/validation.js";

export const createCouponSchema=Joi.object({
    discount:Joi.number().integer().min(1).max(100).required(),
    expiredAt:Joi.date().greater(Date.now()).required(),
}).required()

export const updateCouponSchema=Joi.object({
    discount:Joi.number().integer().min(1).max(100),
    expiredAt:Joi.date().greater(Date.now()),
    code:Joi.string().length(5).required()
});

export const deleteCouponSchema=Joi.object({
    id:Joi.string().custom(validObjectId).required()
})