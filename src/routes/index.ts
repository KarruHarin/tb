import { Router } from "express";
import imageUpload from "./images";
import ContactusRouter from "./contactus";
import adminRouter from './admin'
import categoriesRouter from "./categories";
import orderRouter from "./orders";
import addressRouter from "./address";
import brandRouter from "./brand";
import couponRouter from "./coupon";
import cartRouter from "./cart";
import reviewRouter from "./review";
import testimonalRouter from "./testimonal";
import wishlistRouter from "./wishlist";
import authRouter from "./auth";
import FAQRouter from "./faq";
import productsRouter from "./products";
import userRouter from "./users";
import sizeRouter from "./size";
import imageUploadRouter from "./images";
import AdminAuthRouter from "./adminAuth";


const Routers = Router()

Routers.use('/contact', ContactusRouter)
Routers.use('/admin', adminRouter)
Routers.use('/category', categoriesRouter)
Routers.use('/s3bucket', imageUpload) 
Routers.use('/sub-category', categoriesRouter)
Routers.use('/orders',orderRouter)
Routers.use('/address', addressRouter)
Routers.use('/brand', brandRouter)
Routers.use('/coupon', couponRouter)
Routers.use('/cart', cartRouter)
Routers.use('/review', reviewRouter)
Routers.use('/testimonial', testimonalRouter)
Routers.use('/wishlist', wishlistRouter)
Routers.use('/auth',authRouter)
Routers.use('/admin-auth', AdminAuthRouter)
Routers.use('/faq', FAQRouter)
Routers.use('/product', productsRouter)
Routers.use('/users', userRouter)
Routers.use('/size', sizeRouter)
Routers.use('/images', imageUploadRouter)






export default Routers;