import { Router,Request,Response } from "express";

import dotenv from 'dotenv'
import usersModel from "../models/users";
dotenv.config()

const secret:any = process.env.secret


const userRouter = Router()





userRouter.get('/', async (req:Request,res:Response) => {
    try {

        const response = await usersModel.find()

        res.send(response)
    }
    catch (err:any) {
        res.send({message:'an error occured'})
    }
})

userRouter.get('/pagination', async (req:Request, res: Response) => {
    try {

        const query:any = req?.query
        const page = parseInt(query?.page) || 1;
        const limit = parseInt(query?.limit) || 10;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const response = await usersModel.find().sort({ createdAt: -1 }).limit(limit).skip(startIndex)

        const count = await usersModel.countDocuments().exec()

        let noOfPages = Math.ceil( count /limit) 


        res.send({data:response,page,limit,count,noOfPages})

    }
    catch (err:any) {
        res.send({message:'an error occured'})
    }
})


userRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const updatedUser = await usersModel.findOneAndUpdate({_id:id},{ is_deleted: true },{ new: true });

        if (!updatedUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.send({ message: 'User marked as deleted successfully', updatedUser });

    } catch (error) {
        console.error('Error occurred while marking User as deleted:', error);
        res.status(500).send({ message: 'An error occurred while marking User as deleted' });
    }
});


export default userRouter
