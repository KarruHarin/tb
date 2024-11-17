import express, { Request, Response } from 'express';
import testimonialModel from '../models/testimonal';

const testimonalRouter = express.Router();

testimonalRouter.post('/create-testimonial', async (req: Request, res: Response) => {
    try {
        const { user_id, content, rating } = req.body;

        // Validate required fields
        if (!user_id || !content || content.length === 0) {
            return res.status(400).send({ message: 'All fields (user_id, content, rating) are required' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send({ message: 'Rating must be between 1 and 5' });
        }

        // Create new testimonial
        const testimonial = new testimonialModel({ user_id, content, rating });
        const response = await testimonial.save();

        res.status(201).send(response);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: 'An error occurred' });
    }
});

testimonalRouter.get('/', async (req:Request,res:Response) => {
    try {

        const response = await testimonialModel.find()

        res.send(response)
    }
    catch (err:any) {
        res.send({message:'an error occured'})
    }
})

testimonalRouter.get('/pagination', async (req:Request,res:Response) => {
    try {
        const query:any = req?.query
        const page = parseInt(query?.page) || 1;
        const limit = parseInt(query?.limit) || 10;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const filter = {is_deleted:false}
        const response = await testimonialModel.find(filter).sort({ createdAt: -1 }).limit(limit).skip(startIndex)

        const count = await testimonialModel.countDocuments(filter).exec()

        let noOfPages = Math.ceil( count /limit) 

        res.send({data:response,page,limit,count,noOfPages})

    }
    catch (err:any) {
        res.send({message:'an error occured'})
    }
})


export default testimonalRouter;
