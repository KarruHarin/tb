import express, { Request, Response } from "express";
import couponModel from "../models/coupons";

const couponRouter = express.Router();

// Create a new coupon
couponRouter.post("/create-coupon", async (req: Request, res: Response) => {
    try {
        const { coupon_id, code, discount, start_date, end_date, is_active } = req.body;

        if (!coupon_id || !code || !discount || !start_date || !end_date) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        const coupon = new couponModel({
            coupon_id,
            code,
            discount,
            start_date,
            end_date,
            is_active
        });

        const response = await coupon.save();
        res.status(201).send(response);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while creating the coupon" });
    }
});

couponRouter.get("/coupons", async (req: Request, res: Response) => {
    try {
        const coupons = await couponModel.find({ is_deleted: false });
        res.status(200).send(coupons);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving coupons" });
    }
});

couponRouter.get("/coupon/:id", async (req: Request, res: Response) => {
    try {
        const coupon = await couponModel.findOne({ _id: req.params.id, is_deleted: false });

        if (!coupon) return res.status(404).send({ message: "Coupon not found" });

        res.status(200).send(coupon);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving the coupon" });
    }
});

couponRouter.put("/coupon/:id", async (req: Request, res: Response) => {
    try {
        const { code, discount, start_date, end_date, is_active } = req.body;

        const updatedCoupon = await couponModel.findByIdAndUpdate(
            req.params.id,
            { code, discount, start_date, end_date, is_active },
            { new: true }
        );

        if (!updatedCoupon) return res.status(404).send({ message: "Coupon not found" });

        res.status(200).send(updatedCoupon);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while updating the coupon" });
    }
});

couponRouter.delete("/coupon/:id", async (req: Request, res: Response) => {
    try {
        const deletedCoupon = await couponModel.findByIdAndUpdate(
            req.params.id,
            { is_deleted: true },
            { new: true }
        );

        if (!deletedCoupon) return res.status(404).send({ message: "Coupon not found" });

        res.status(200).send({ message: "Coupon deleted successfully" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while deleting the coupon" });
    }
});

export default couponRouter;
