import mongoose from "mongoose";

const contactSettingsSchema = new mongoose.Schema(
    {
        facebook: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        whatsapp: { type: String, default: "" },
        address: { type: String, default: "" },
        description: { type: String, default: "" },
    },
    { timestamps: true }
);

const ContactSettings = mongoose.model("ContactSettings", contactSettingsSchema);

export default ContactSettings