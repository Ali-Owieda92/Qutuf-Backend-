import express from "express";
import {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteSingleImage,
    deleteProject,
} from "../controllers/projectController.js";

import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProject);

router.post(
    "/",
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "gallery", maxCount: 20 }
    ]),
    createProject
);

router.put(
    "/:id",
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "gallery", maxCount: 20 }
    ]),
    updateProject
);

router.delete("/:id/gallery/*", deleteSingleImage);

router.delete("/:id", deleteProject);

export default router;