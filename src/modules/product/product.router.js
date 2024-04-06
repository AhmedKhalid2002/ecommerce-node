import { Router } from "express";
import { isAuthenticated } from "../../middleware/authuntication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.js";
import { fileUpload } from "../../utils/fileUpload.js";
import * as productSchema from './product.schema.js'
import * as productController from './product.controller.js'
import reviewRouter from "../review/review.router.js";

const productRouter=Router();

productRouter.use("/:productId/review",reviewRouter)

//^ create product
productRouter.post("/",isAuthenticated,isAuthorized("seller"),fileUpload().fields([{name:"defaultImage",maxCount:1},{name:"subImage",maxCount:3}]),validation(productSchema.createProductSchema),productController.createProduct)

// ^ delete product
productRouter.delete("/:id",isAuthenticated,isAuthorized("seller"),validation(productSchema.deleteProductSchema),productController.deleteProduct)

// ^ all product
productRouter.get("/",productController.allProduct)



export default productRouter;