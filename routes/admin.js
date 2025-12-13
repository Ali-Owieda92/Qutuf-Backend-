import express from "express";
import { loginAdmin, updateAdmin } from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.put("/", authMiddleware, updateAdmin);

export default router;