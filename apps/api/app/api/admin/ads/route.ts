import Ad from "@/models/Ad";
import Setting from "@/models/Setting"
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    const adminPassword = req.headers.authorization ? req.headers.authorization : "";
        try {
            const admin = await Setting.findOne();
            if (admin.password === adminPassword) {
                if (req.method === "POST") {
                    const {
                        background,
                        background2,
                        // image,
                        image2,
                        // image3,
                        title,
                        text,
                        logo,
                        link,
                    } = req.body;
                    try {
                        const ad = await Ad.create({
                            background,
                            background2,
                            // image,
                            image2,
                            // image3,
                            title,
                            text,
                            logo,
                            link,
                        });
                        return res.status(201).json({
                            success: true,
                            message: "Ad created successfully",
                            data: ad,
                        });
                    } catch (error) {
                        return res
                            .status(400)
                            .json({ success: false, message: error.message });
                    }
                } else if (req.method === "GET") {
                    return res
                        .status(405)
                        .json({ success: false, message: "GET method is not allowed" });
                } else if (req.method === "PUT") {
                    const {
                        id,
                        background,
                        background2,
                        // image,
                        image2,
                        // image3,
                        title,
                        text,
                        logo,
                        link,
                    } = req.body;
                    try {
                        const ad = await Ad.findByIdAndUpdate(id, {
                            background,
                            background2,
                            // image,
                            image2,
                            // image3,
                            title,
                            text,
                            logo,
                            link,
                        }, { new: true });
                        if (!ad) {
                            return res.status(400).json({ success: false, message: "Ad not updated" });
                        }
                        return res.status(200).json({ success: true, message: "Ad updated successfully", data: ad });
                    } catch (error) {
                        return res
                            .status(400)
                            .json({ success: false, message: error.message });
                    }
                } else if (req.method === "DELETE") {
                    const {
                        id
                    } = req.body;
                    try {
                        const ad = await Ad.findByIdAndDelete(id);
                        if (!ad) {
                            return res.status(400).json({ success: false, message: "Ad neištrintas" });
                        }
                        return res.status(200).json({ success: true, message: "Ad ištrintas successfully", data: ad });
                    } catch (error) {
                        return res
                            .status(400)
                            .json({ success: false, message: error.message });
                    }
                } else {
                    return res.status(200).json({
                        success: true,
                        message:
                            "Hello there, how are you? Since you are here now, maybe reach out to sc0rp10n-py on github or sc0rp10n_py on twitter",
                    });
                }
            }
            return res
                .status(400)
                .json({ success: false, message: "Not Authorized" });
        } catch (error) {
            console.log(error);
            return res
                .status(400)
                .success({ success: false, message: error.message });
        }
};

export default dbConnect(handler);

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Set the limit to 10mb
        },
    },
};