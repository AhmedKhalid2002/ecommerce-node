import Joi from "joi"

// ^ signup schema
export const signupSchema=Joi.object({
    userName:Joi.string().min(3).max(20).required(),
    email:Joi.string().email().required(),
    password:Joi.string().required(),
    confirmPassword:Joi.string().valid(Joi.ref("password")).required(),
    gender:Joi.string().valid("male","fmale").required(),
    phone:Joi.string().pattern(new RegExp("^(01)[0-9]{9}$")).required(),
}).required();

//^ activate account schema

export const activateAcountSchema=Joi.object({
    token:Joi.string().required()
}).required()

// ^ login schema
export const loginSchema=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required(),
}).required()

// ^ forget Code schema
export const forgetCodeSchema=Joi.object({
    email:Joi.string().email().required(),
}).required();

// ^ reset password schema
export const resetPasswordSchema=Joi.object({
    email:Joi.string().email().required(),
    forgetCode:Joi.string().length(5).required(),
    password:Joi.string().required(),
}).required()