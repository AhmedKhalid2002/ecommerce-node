import { Router } from "express";
import { isAuthenticated } from "../../middleware/authuntication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.js";
import * as orderSchema from './order.schema.js';
import * as orderController from './order.controller.js'

const OrderRouter=Router();

// ^ create order
OrderRouter.post("/",isAuthenticated,isAuthorized("user"),validation(orderSchema.createOrder),orderController.createOrder)


//^  cancel product
OrderRouter.patch("/:id",isAuthenticated,isAuthorized("user"),validation(orderSchema.cancelOrder),orderController.cancelOrder)

export default OrderRouter;