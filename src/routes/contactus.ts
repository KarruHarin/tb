import express, { Request, Response } from "express";
import contactusModel from "../models/contactus";


const contactUsRouter = express.Router();

contactUsRouter.post("/create-contact", async (req: Request, res: Response) => {
    try {
        const { name, email, reason, phone, message } = req.body;

        if (!name || !email || !reason || !phone || !message) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const newContact = new contactusModel({ name, email, reason, phone, message });
        const savedContact = await newContact.save();

        res.status(201).send(savedContact);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while creating the contact entry" });
    }
});

contactUsRouter.get("/contact-entries", async (req: Request, res: Response) => {
    try {
        const contactEntries = await contactusModel.find({ is_deleted: false });
        res.status(200).send(contactEntries);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving contact entries" });
    }
});

contactUsRouter.get("/contact/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const contactEntry = await contactusModel.findById(id);

        if (!contactEntry || contactEntry.is_deleted) {
            return res.status(404).send({ message: "Contact entry not found" });
        }

        res.status(200).send(contactEntry);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving the contact entry" });
    }
});

contactUsRouter.delete("/contact/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedContact = await contactusModel.findByIdAndUpdate(
            id,
            { is_deleted: true },
            { new: true }
        );

        if (!deletedContact) {
            return res.status(404).send({ message: "Contact entry not found" });
        }

        res.status(200).send({ message: "Contact entry deleted successfully" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while deleting the contact entry" });
    }
});

contactUsRouter.put("/contact/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, reason, phone, message } = req.body;

        if (!name || !email || !reason || !phone || !message) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const updatedContact = await contactusModel.findByIdAndUpdate(
            id,
            { name, email, reason, phone, message },
            { new: true }
        );

        if (!updatedContact) {
            return res.status(404).send({ message: "Contact entry not found" });
        }

        res.status(200).send(updatedContact);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while updating the contact entry" });
    }
});

export default contactUsRouter;
