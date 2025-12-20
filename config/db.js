import mongoose from "mongoose";
import { createDefaultAdmin } from "../controllers/adminController.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        await createDefaultAdmin();
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error; 
    }
};

export default connectDB;