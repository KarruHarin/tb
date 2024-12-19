

import { Router,Request,Response } from "express";
import categoryModel from "../models/categories";

const categoriesRouter = Router()


categoriesRouter.get('/', async (req:Request,res:Response) => {
    try {

        const response = await categoryModel.find()

        res.send(response)
    }
    catch (err:any) {
        res.send({message:'an error occured'})
    }
})

categoriesRouter.get('/pagination', async (req:Request,res:Response) => {
    try {
        const query:any = req?.query
        const page = parseInt(query?.page) || 1;
        const limit = parseInt(query?.limit) || 10;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const filter = {is_deleted:false}
        const response = await categoryModel.find(filter).sort({ createdAt: -1 }).limit(limit).skip(startIndex)

        const count = await categoryModel.countDocuments(filter).exec()

        let noOfPages = Math.ceil( count /limit) 

        res.send({data:response,page,limit,count,noOfPages})

    }
    catch (err:any) {
        res.send({message:'an error occured'})
    }
})


export default categoriesRouter;