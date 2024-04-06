import Joi from "joi";
import { validObjectId } from "../../middleware/validation.js";

export const createOrder=Joi.object({
    phone:Joi.string().required(),
    address:Joi.string().required(),
    payment:Joi.string().valid("cash","visa"),
    coupon:Joi.string().length(5),
}).required();

export const cancelOrder=Joi.object({
    id:Joi.string().custom(validObjectId)
}).required()