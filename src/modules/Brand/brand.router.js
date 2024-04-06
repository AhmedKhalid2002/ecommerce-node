import { Router } from "express";
import * as brandController from "./brand.controller.js";
import * as brandSchema from "./brand.schema.js";
import { isAuthenticated } from "../../middleware/authuntication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middleware/validation.js";

const brandRouter =Router();

// ^ create Brand
brandRouter.post('/',isAuthenticated,isAuthorized("admin"),fileUpload().single('brand'),validation(brandSchema.createBrandSchema),brandController.createBrand)

// ^ update Brand
brandRouter.patch('/:id',isAuthenticated,isAuthorized("admin"),fileUpload().single('brand'),validation(brandSchema.updateBrandSchema),brandController.updateBrand)

// ^ delete Brand
brandRouter.delete('/:id',isAuthenticated,isAuthorized("admin"),validation(brandSchema.deleteBrandSchema),brandController.deleteBrand)

// ^ all Brand
brandRouter.get('/',brandController.allBrand)

export default brandRouter;