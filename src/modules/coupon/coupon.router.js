import { Router } from "express";
import { isAuthenticated } from "../../middleware/authuntication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.js";
import * as couponSchema from "../coupon/coupon.schema.js"
import * as controllerCoupon from "../coupon/coupon.controller.js"

const couponRouter=Router();

// ^ create coupon
couponRouter.post("/",isAuthenticated,isAuthorized("seller"),validation(couponSchema.createCouponSchema),controllerCoupon.createCoupon)

// ^ update coupon
couponRouter.patch("/:code",isAuthenticated,isAuthorized("seller"),validation(couponSchema.updateCouponSchema),controllerCoupon.updateCoupon)

// ^ delete coupon
couponRouter.delete("/:id",isAuthenticated,isAuthorized("seller"),validation(couponSchema.deleteCouponSchema),controllerCoupon.deleteCoupon)

// ^ all coupon
couponRouter.get("/",isAuthenticated,isAuthorized("seller","admin"),controllerCoupon.allCoupons)

export default couponRouter;