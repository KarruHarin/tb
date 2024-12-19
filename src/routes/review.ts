import express, { Request, Response } from 'express';
import reviewModel from '../models/review';

const reviewRouter = express.Router();

reviewRouter.post('/create-review', async (req: Request, res: Response) => {
    try {
        const { user_id, product_id, rating, comment } = req.body;

        if (!user_id || !product_id || !rating || !comment) {
            return res.status(400).send({ message: 'All fields (user_id, product_id, rating, comment) are required' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send({ message: 'Rating must be between 1 and 5' });
        }

        const review = new reviewModel({ user_id, product_id, rating, comment });
        const response = await review.save();

        res.status(201).send(response);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: 'An error occurred' });
    }
});

reviewRouter.get('/pagination', async (req:Request,res:Response) => {
    try {
        const query:any = req?.query
        const page = parseInt(query?.page) || 1;
        const limit = parseInt(query?.limit) || 10;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const filter = {is_deleted:false}
        const response = await reviewModel.find(filter).sort({ createdAt: -1 }).limit(limit).skip(startIndex)

        const count = await reviewModel.countDocuments(filter).exec()

        let noOfPages = Math.ceil( count /limit) 

        res.send({data:response,page,limit,count,noOfPages})

    }
    catch (err:any) {
        res.send({message:'an error occured'})
    }
})

reviewRouter.get("/products", async (req: Request, res: Response) => {
    try {
        const products = await reviewModel.find({ is_deleted: false });
        res.status(200).send(products);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving Reviews" });
    }
});


export default reviewRouter;