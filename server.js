import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from "helmet";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

import connectDB from './config/db.js';

import admin from "./routes/admin.js"
import projects from "./routes/projects.js"
import contactSettingsRoute from "./routes/contact.js";

connectDB();

const app = express();

app.use(cors({
    origin: ["https://qutufeg.com","http://localhost:5174", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.get('/', (req, res) => {
    res.send('Qutuf API is running');
});

app.use("/api/auth", admin);
app.use("/api/projects", projects);
app.use("/api/contact-settings", contactSettingsRoute);


app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});