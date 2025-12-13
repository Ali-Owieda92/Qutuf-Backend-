import express from "express";
import {
    getContactSettings,
    updateContactSettings,
} from "../controllers/contactController.js"
const router = express.Router();

router.get("/", getContactSettings);
router.post("/", updateContactSettings);

export default router;
