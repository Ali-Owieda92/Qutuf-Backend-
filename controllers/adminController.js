import Admin from "../models/Admin.js";
import { signToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";

export const createDefaultAdmin = async () => {
        const exists = await Admin.findOne();
        if (!exists) {
            const hashed = await bcrypt.hash("admin123", 10);
            await Admin.create({
            username: "admin",
            password: hashed,
        });
        console.log("Default admin created");
        }   
};

export const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ message: "Invalid username" });

        const match = await bcrypt.compare(password, admin.password);
        if (!match) return res.status(400).json({ message: "Invalid password" });

            res.json({
            message: "Login successful",
            admin: {
                id: admin._id,
                username: admin.username,
            },
            token: signToken({ id: admin._id, username: admin.username })
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const hashed = await bcrypt.hash(password, 10);

        const updated = await Admin.findOneAndUpdate(
            {},
            { username, password: hashed },
            { new: true }
        );

        res.json({ message: "Admin updated", admin: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};