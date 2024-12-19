import { Router, Request, Response } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomBytes } from "crypto";
import { promisify } from "util";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const randomBytesAsync = promisify(randomBytes);

const bucketName = process.env.BUCKET_NAME!;
const bucketRegion = process.env.BUCKET_REGION!;
const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

router.post("/get-presigned-urls", async (req: Request, res: Response) => {
  try {
    const { files } = req.body;

    if (!files || !Array.isArray(files)) {
      return res.status(400).send({ message: "Invalid request, files are required." });
    }

    const presignedUrls = await Promise.all(
      files.map(async (file: { filename: string; filetype: string }) => {
        const randomString = (await randomBytesAsync(16)).toString("hex");
        const fileKey = `products/${randomString}-${file.filename}`;

        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
          ContentType: file.filetype,
        });

        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return { url, fileUrl: `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileKey}` };
      })
    );

    res.status(200).send({ presignedUrls });
  } catch (error) {
    console.error("Error generating presigned URLs:", error);
    res.status(500).send({ message: "Could not generate presigned URLs" });
  }
});

export default router;
