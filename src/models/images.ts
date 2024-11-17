import mongoose, { Schema, Document } from "mongoose";

// Interface for Images
interface IImage extends Document {
    image_url: string;
}

const imageSchema: Schema = new mongoose.Schema({
    image_url: { type: String, required: true },
})

const ImageModel = mongoose.model<IImage>("Image", imageSchema);

export default ImageModel;
