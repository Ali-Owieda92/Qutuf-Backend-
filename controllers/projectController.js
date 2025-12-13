import Project from "../models/Project.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";

export const createProject = async (req, res) => {
  try {
    const { title, category, description, location, status } = req.body;
    if (!req.files || !req.files.coverImage) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    const coverUpload = await uploadToCloudinary(
      req.files.coverImage[0].buffer,
      "qutuf/cover"
    );

    let galleryUploads = [];
    if (req.files.gallery) {
      galleryUploads = await Promise.all(
        req.files.gallery.map((file) =>
          uploadToCloudinary(file.buffer, "qutuf/gallery")
        )
      );
    }

    const project = await Project.create({
      title,
      category,
      description,
      location,
      status,
      coverImage: { url: coverUpload.url, public_id: coverUpload.public_id },
      images: galleryUploads.map((img) => ({
        url: img.url,
        public_id: img.public_id,
      })),
    });

    res.status(201).json({ message: "Project created", project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) return res.status(404).json({ message: "Not found" });

    const { title, category, description, location, status } = req.body;

    if (req.files.coverImage) {
      if (project.coverImage?.public_id) {
        await deleteFromCloudinary(project.coverImage.public_id);
      }

      const coverUpload = await uploadToCloudinary(
        req.files.coverImage[0].buffer,
        "qutuf/cover"
      );
      project.coverImage = {
        url: coverUpload.url,
        public_id: coverUpload.public_id,
      };
    }

    if (req.files.gallery) {
      const galleryUploads = await Promise.all(
        req.files.gallery.map((file) =>
          uploadToCloudinary(file.buffer, "qutuf/gallery")
        )
      );

      project.images.push(
        ...galleryUploads.map((img) => ({
          url: img.url,
          public_id: img.public_id,
        }))
      );
    }

    project.title = title || project.title;
    project.category = category || project.category;
    project.description = description || project.description;
    project.location = location || project.location;
    project.status = status || project.status;

    const updated = await project.save();
    res.json({ message: "Updated", project: updated });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });

    if (project.coverImage?.public_id) {
      await deleteFromCloudinary(project.coverImage.public_id);
    }

    for (const img of project.images) {
      if (img.public_id) await deleteFromCloudinary(img.public_id);
    }

    await project.deleteOne();
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSingleImage = async (req, res) => {
  try {
    const { id } = req.params;
    const public_id = req.params[0];

    console.log("Deleting:", public_id);

    await deleteFromCloudinary(public_id);

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $pull: { images: { public_id } } },
      { new: true }
    );

    return res.json({ success: true, updatedProject });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting image" });
  }
};
