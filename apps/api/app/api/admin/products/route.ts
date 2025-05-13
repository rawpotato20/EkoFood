import Product from "@/models/Product";
import Setting from "@/models/Setting";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    const adminPassword = req.headers.authorization ? req.headers.authorization : "";
        try {
            const admin = await Setting.findOne();
            if (admin.password === adminPassword) {
                if (req.method === "POST") {
                    const {
                        name,
                        image,
                        gallery,
                        volumes,
                        options,
                        heading1,
                        text1,
                        heading2,
                        text2,
                        heading3,
                        text3,
                        heading4,
                        text4,
                    } = req.body;
                    try {
                        const product = await Product.create({
                            name,
                            image,
                            gallery,
                            volumes,
                            options,
                            heading1,
                            text1,
                            heading2,
                            text2,
                            heading3,
                            text3,
                            heading4,
                            text4,
                        });
                        return res.status(201).json({
                            success: true,
                            message: "Product created successfully",
                            data: product,
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
                        name,
                        image,
                        gallery,
                        volumes,
                        options,
                        heading1,
                        text1,
                        heading2,
                        text2,
                        heading3,
                        text3,
                        heading4,
                        text4,
                    } = req.body;
                    try {
                        const product = await Product.findByIdAndUpdate(id, {
                            name,
                            image,
                            gallery,
                            volumes,
                            options,
                            heading1,
                            text1,
                            heading2,
                            text2,
                            heading3,
                            text3,
                            heading4,
                            text4,
                        }, { new: true });
                        if (!product) {
                            return res.status(400).json({ success: false, message: "Product not updated" });
                        }
                        return res.status(200).json({ success: true, message: "Product updated successfully", data: product });
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
                        const product = await Product.findByIdAndDelete(id)
                        if (!product) {
                            return res.status(400).json({ success: false, message: "Produktas neištrintas" });
                        }
                        return res.status(200).json({ success: true, message: "Produktas ištrintas successfully", data: product });
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