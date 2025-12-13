import ContactSettings from "../models/ContactSettings.js";

export const getContactSettings = async (req, res) => {
    try {
        const settings = await ContactSettings.findOne();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const updateContactSettings = async (req, res) => {
    try {
        const data = req.body;

        let settings = await ContactSettings.findOne();

        if (!settings) {
            settings = await ContactSettings.create(data);
        } else {
            await ContactSettings.updateOne({}, data);
            settings = await ContactSettings.findOne();
        }

        res.json({
            message: "Contact settings saved successfully",
            data: settings,
        });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
};