import express from 'express'
import dotenv from 'dotenv'
import { connectionDB } from './DB/connection.js';
import authRouter from './src/modules/auth/auth.router.js';
import categoryRouter from './src/modules/category/category.router.js';
import subCategoryRouter from './src/modules/subCategory/subCategory.router.js';
import brandRouter from './src/modules/Brand/brand.router.js';
import couponRouter from './src/modules/coupon/coupon.router.js';
import productRouter from './src/modules/product/product.router.js';
import cartRouter from './src/modules/cart/cart.router.js';
import OrderRouter from './src/modules/order/order.router.js';
import morgan from 'morgan';

dotenv.config()
const app = express();
const port = process.env.PORT;


// ^ morgan
app.use(morgan('combined'))

// ^ parsing
app.use(express.json());

// ^ connect DB
connectionDB()

// ^ routers
app.use("/auth",authRouter)
app.use("/category",categoryRouter)
app.use("/subCategory",subCategoryRouter)
app.use("/brand",brandRouter)
app.use("/coupon",couponRouter)
app.use("/product",productRouter)
app.use("/cart",cartRouter)
app.use("/order",OrderRouter)


// ^ error not found
app.all("*",(req,res,next)=>{
    return next(new Error("The page not found",{cause:404}))
})

// ^ global error
app.use((error,req,res,next)=>{
    const statusCode=error.cause || 500;
    return res.status(statusCode).json({
        message:error.message,
        stack:error.stack
    })
})
app.listen(port, () => console.log(`App listening on port ${port}!`))
