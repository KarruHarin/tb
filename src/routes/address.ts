import express, { Request, Response } from "express";
import addressModel from "../models/address";

const addressRouter = express.Router();

// Add a new address
addressRouter.post("/add-address", async (req: Request, res: Response) => {
    try {
        const { name, user_id, phone_number, pincode, locality, address, city, state, landmark, alternate_phone_number, address_type } = req.body;

        if (!user_id || !name || !phone_number || !pincode || !locality || !address || !city || !state || !address_type) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        const newAddress = new addressModel({
            name,
            user_id,
            phone_number,
            pincode,
            locality,
            address,
            city,
            state,
            landmark,
            alternate_phone_number,
            address_type
        });

        const savedAddress = await newAddress.save();
        res.status(201).send(savedAddress);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while adding the address" });
    }
});

// Get all addresses for a specific user
addressRouter.get("/addresses/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const addresses = await addressModel.find({ user_id: userId, is_deleted: false });
        res.status(200).send(addresses);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving addresses" });
    }
});

// Update an address by ID
addressRouter.put("/address/:addressId", async (req: Request, res: Response) => {
    try {
        const { addressId } = req.params;
        const { name, phone_number, pincode, locality, address, city, state, landmark, alternate_phone_number, address_type } = req.body;

        if (!name || !phone_number || !pincode || !locality || !address || !city || !state || !address_type) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        const updatedAddress = await addressModel.findByIdAndUpdate(
            addressId,
            {
                name,
                phone_number,
                pincode,
                locality,
                address,
                city,
                state,
                landmark,
                alternate_phone_number,
                address_type
            },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).send({ message: "Address not found" });
        }

        res.status(200).send(updatedAddress);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while updating the address" });
    }
});

// Soft-delete an address by ID
addressRouter.delete("/address/:addressId", async (req: Request, res: Response) => {
    try {
        const { addressId } = req.params;

        const deletedAddress = await addressModel.findByIdAndUpdate(
            addressId,
            { is_deleted: true },
            { new: true }
        );

        if (!deletedAddress) {
            return res.status(404).send({ message: "Address not found" });
        }

        res.status(200).send({ message: "Address deleted successfully" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while deleting the address" });
    }
});

export default addressRouter;
