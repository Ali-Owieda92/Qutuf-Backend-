import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    url: String,
    public_id: String,
});

const projectSchema = mongoose.Schema({
    title: { type: String, required: true },
    category: {
        type: String,
        enum: ["Apartment", "Villa", "Interior"],
        required: true,
    },
    description: { type: String, required: true },
    coverImage: imageSchema,
    images: [imageSchema],
    location: { type: String, default: "Not specified" },
    status: {
        type: String,
        enum: ["ongoing", "completed"],
        default: "completed",
    },
    },
    { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;