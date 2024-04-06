import { Router } from "express";
import { isAuthenticated } from "../../middleware/authuntication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.js";
import * as cartController from "./cart.controller.js"
import * as cartSchema from "./cart.schema.js"
const cartRouter=Router();

// ^ add to cart
cartRouter.post("/",isAuthenticated,isAuthorized("user"),validation(cartSchema.addCartSchema),cartController.addCart)

// ^ get user cart
cartRouter.get("/",isAuthenticated,isAuthorized("user","admin"),validation(cartSchema.userCartSchema),cartController.userCart)

// ^ update cart
cartRouter.patch("/",isAuthenticated,isAuthorized("user"),validation(cartSchema.updateCartSchema),cartController.updateCart)

// ^ remove product from cart
cartRouter.delete("/",isAuthenticated,isAuthorized("user"),validation(cartSchema.deleteCartSchema),cartController.deleteCart)

// ^ clear cart
cartRouter.delete("/clear",isAuthenticated,isAuthorized("user"),cartController.clearCart)


export default cartRouter;