import { Router } from "express";
import { isAuthenticated } from "../../middleware/authuntication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.js";
import * as subCategorySchema from "./subCategory.schema.js";
import * as subCategoryController from "./subCategory.controller.js";
import { fileUpload } from "../../utils/fileUpload.js";

const subCategoryRouter=Router({mergeParams:true});

// ^ create sub category
subCategoryRouter.post(
    "/",
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload().single("subCategory"),
    validation(subCategorySchema.createSubCategorySchema),
    subCategoryController.createSubCategory
)

// ^ update subcategory
subCategoryRouter.put("/:id",isAuthenticated,isAuthorized("admin"),fileUpload().single("subCategory"),validation(subCategorySchema.updateSubCategorySchema),subCategoryController.updateSubCategory)

// ^ delete subcategory
subCategoryRouter.delete("/:id",isAuthenticated,isAuthorized("admin"),validation(subCategorySchema.deleteSubCategorySchema),subCategoryController.deleteSubCategory)

// ^ get all subcategory
subCategoryRouter.get("/",subCategoryController.allSubCategory)


export default subCategoryRouter;