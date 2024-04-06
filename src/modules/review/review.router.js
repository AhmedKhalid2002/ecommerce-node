import { Router } from "express";
import { isAuthenticated } from "../../middleware/authuntication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.js";
import * as reviewSchema from "./review.schema.js"
import * as reviewController from "./review.controller.js"

const reviewRouter=Router({mergeParams:true});

// ^ add review
reviewRouter.post("/",isAuthenticated,isAuthorized("user"),validation(reviewSchema.addReview),reviewController.addReview)

// ^ update review
reviewRouter.patch("/:id",isAuthenticated,isAuthorized("user"),validation(reviewSchema.updateReview),reviewController.updateReview)

export default reviewRouter;