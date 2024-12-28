import express, { Request, Response } from "express";
import FAQModel from "../models/faq";

const FAQRouter = express.Router();

FAQRouter.post("/", async (req: Request, res: Response) => {
    const { question, answer, is_published } = req.body;

    try {
        const newFAQ = new FAQModel({ question, answer, is_published });
        await newFAQ.save();
        res.status(201).json(newFAQ);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating FAQ" });
    }
});

FAQRouter.get("/", async (req: Request, res: Response) => {
    try {
        const faqs = await FAQModel.find({ is_published: true }); // Only fetch published FAQs
        res.status(200).json(faqs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching FAQs" });
    }
});


FAQRouter.get('/pagination', async (req: Request, res: Response) => {
    try {
        const query: any = req.query;
        const page = Math.max(1, parseInt(query?.page) || 1);
        const limit = Math.max(1, parseInt(query?.limit) || 10);

        const startIndex = (page - 1) * limit;

        const filter = { is_published: true, $or: [{ is_deleted: false }, { is_deleted: { $exists: false } }] };

        const data = await FAQModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        const count = await FAQModel.countDocuments(filter);

        const noOfPages = Math.ceil(count / limit);

        res.status(200).send({
            data,
            page,
            limit,
            count,
            noOfPages,
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({ message: 'An error occurred while fetching FAQs with pagination.' });
    }
});





// Get FAQ by ID
FAQRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const faq = await FAQModel.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({ error: "FAQ not found" });
        }
        res.status(200).json(faq);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching FAQ" });
    }
});

// Update FAQ by ID
FAQRouter.put("/:id", async (req: Request, res: Response) => {
    const { question, answer, is_published } = req.body;

    try {
        const updatedFAQ = await FAQModel.findByIdAndUpdate(
            req.params.id,
            { question, answer, is_published },
            { new: true } // Return the updated document
        );

        if (!updatedFAQ) {
            return res.status(404).json({ error: "FAQ not found" });
        }

        res.status(200).json(updatedFAQ);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating FAQ" });
    }
});

// Delete FAQ by ID
FAQRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const deletedFAQ = await FAQModel.findByIdAndDelete(req.params.id);

        if (!deletedFAQ) {
            return res.status(404).json({ error: "FAQ not found" });
        }

        res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting FAQ" });
    }
});

export default FAQRouter;
