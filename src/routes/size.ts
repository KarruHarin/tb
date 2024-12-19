import express, { Request, Response } from "express";
import sizeModel from "../models/size";


const sizeRouter = express.Router();

// Create a new size
sizeRouter.post("/create-size", async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).send({ message: "Size name is required" });
        }

        // Check if the size name already exists
        const existingSize = await sizeModel.findOne({ name: name.trim() });
        if (existingSize) {
            return res.status(400).send({ message: "Size name already exists" });
        }

        const newSize = new sizeModel({ name: name.trim() });
        const savedSize = await newSize.save();

        res.status(201).send(savedSize);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while creating the size" });
    }
});


sizeRouter.get('/pagination', async (req:Request,res:Response) => {
    try {
        const query:any = req?.query
        const page = parseInt(query?.page) || 1;
        const limit = parseInt(query?.limit) || 10;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const filter = {is_deleted:false}
        const response = await sizeModel.find(filter).sort({ createdAt: -1 }).limit(limit).skip(startIndex)

        const count = await sizeModel.countDocuments(filter).exec()

        let noOfPages = Math.ceil( count /limit) 

        res.send({data:response,page,limit,count,noOfPages})

    }
    catch (err:any) {
        res.send({message:'an error occured'})
    }
})

sizeRouter.get("/sizes", async (req: Request, res: Response) => {
    try {
        const sizes = await sizeModel.find({ is_deleted: false });
        res.status(200).send(sizes);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving sizes" });
    }
});

sizeRouter.get("/size/:name", async (req: Request, res: Response) => {
    try {
        const { name } = req.params;
        const size = await sizeModel.findOne({ name, is_deleted: false });

        if (!size) {
            return res.status(404).send({ message: "size not found" });
        }

        res.status(200).send(size);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving the size" });
    }
});

// Update a size by name
sizeRouter.put("/size/:name", async (req: Request, res: Response) => {
    try {
        const { name } = req.params;
        const { newName } = req.body;

        if (!newName) {
            return res.status(400).send({ message: "New size name is required" });
        }

        const updatedsize = await sizeModel.findOneAndUpdate(
            { name, is_deleted: false },
            { name: newName },
            { new: true }
        );

        if (!updatedsize) {
            return res.status(404).send({ message: "size not found" });
        }

        res.status(200).send(updatedsize);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while updating the size" });
    }
});

// Soft delete a size by name
sizeRouter.delete("/size/:name", async (req: Request, res: Response) => {
    try {
        const { name } = req.params;

        const deletedsize = await sizeModel.findOneAndUpdate(
            { name },
            { is_deleted: true },
            { new: true }
        );

        if (!deletedsize) {
            return res.status(404).send({ message: "size not found" });
        }

        res.status(200).send({ message: "size deleted successfully" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while deleting the size" });
    }
});

export default sizeRouter;
