import express, { Request, Response } from 'express';
import testimonialModel from '../models/testimonal';

const testimonalRouter = express.Router();

// Create a new testimonial
testimonalRouter.post('/create-testimonial', async (req: Request, res: Response) => {
    try {
        const { user_name, content, rating } = req.body;

        // Validate required fields
        if (!user_name || !content || content.trim().length === 0) {
            return res.status(400).send({ message: 'All fields (user_id, content, rating) are required' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send({ message: 'Rating must be between 1 and 5' });
        }

        // Create new testimonial
        const testimonial = new testimonialModel({
            // user_id,
            user_name,
            content,
            rating,
            is_approved: false,
            is_deleted: false,
        });
        const response = await testimonial.save();

        res.status(201).send({ message: 'Testimonial created successfully', testimonial: response });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: 'An error occurred while creating the testimonial' });
    }
});

// Fetch all testimonials
testimonalRouter.get('/', async (req: Request, res: Response) => {
    try {
        const testimonials = await testimonialModel
            .find({ is_deleted: false })
            .populate('user_id', 'firstName lastName');

        res.status(200).send(testimonials);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: 'An error occurred while fetching testimonials' });
    }
});

// Paginated testimonials
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
