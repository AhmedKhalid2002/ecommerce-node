import { Router } from "express";
import {validation}  from '../../middleware/validation.js'
import * as authController from "./auth.controller.js";
import * as authSchema  from "./auth.schema.js";
const authRouter=Router();

// ^ signup 

authRouter.post("/signup",validation(authSchema.signupSchema),authController.signup)

// ^ activate account 
authRouter.get("/active_account/:token",validation(authSchema.activateAcountSchema),authController.activateAcount);

// ^ login
authRouter.post("/login",validation(authSchema.loginSchema),authController.login);

// ^ send code 
authRouter.patch("/forgetCode",validation(authSchema.forgetCodeSchema),authController.sendCode)

// ^ reset password 
authRouter.patch("/resetPassword",validation(authSchema.resetPasswordSchema),authController.resetPassword)

export default authRouter;