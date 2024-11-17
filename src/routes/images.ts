import { Router, Request, Response } from "express";
import crypto from "crypto";
import aws from "aws-sdk";
import { promisify } from "util";
import dotenv from "dotenv";
import ImageModel from "../models/images";

const randomBytes = promisify(crypto.randomBytes);

dotenv.config();

const bucketName: string = process.env.BUCKET_NAME!;
const bucketRegion: string = process.env.BUCKET_REGION!;
const accessKey: string = process.env.ACCESS_KEY!;
const secretAccessKey: string = process.env.SECRET_ACCESS_KEY!;

const imageUpload = Router();

const preS3 = new aws.S3({
    region: bucketRegion,
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
    signatureVersion: "v4",
});

imageUpload.post("/bulk", async (req: Request, res: Response) => {
    try {
        const response = await ImageModel.insertMany(req.body);
        res.status(201).send({ message: "Success", data: response });
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    }
});

imageUpload.get("/get-url", async (req: Request, res: Response) => {
    try {
        const rawBytes = await randomBytes(16);
        const imageName = rawBytes.toString("hex"); 
        const params = {
            Bucket: bucketName,
            Key: `images/${imageName}`, 
            Expires: 60, 
        };

        const uploadURL = await preS3.getSignedUrlPromise("putObject", params);
        return res.status(200).send(uploadURL);
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    }
});

export default imageUpload;
