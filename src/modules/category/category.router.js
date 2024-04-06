import { Router } from "express";
import {isAuthenticated} from '../../middleware/authuntication.middleware.js'
import {isAuthorized} from '../../middleware/authorization.middleware.js'
import { validation } from "../../middleware/validation.js";
import * as categorySchema from '../category/category.schema.js'
import {fileUpload} from '../../utils/fileUpload.js'
import * as categoryController from "./category.controller.js";
import subCategoryRouter from "../subCategory/subCategory.router.js";
const categoryRouter=Router();

// ^ create category

categoryRouter.use("/:categoryId/subCategory",subCategoryRouter)

categoryRouter.post("/createCategory",isAuthenticated,isAuthorized("admin"),fileUpload().single("category"),validation(categorySchema.createCategorySchema),categoryController.createCategory)

// ^ update category
categoryRouter.put("/updateCategory/:id",isAuthenticated,isAuthorized("admin"),fileUpload().single("category"),validation(categorySchema.updateCategorySchema),categoryController.updateCategory)

// ^ delete category
categoryRouter.delete("/deleteCategory/:id",isAuthenticated,isAuthorized("admin"),validation(categorySchema.deleteCategorySchema),categoryController.deleteCategory)

// ^ get all category
categoryRouter.get("/",categoryController.allCategory)

export default categoryRouter;