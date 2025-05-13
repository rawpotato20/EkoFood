import Setting from "@/models/Setting";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { password, new_password } = req.body;
        try {
            const admin = await Setting.findOne();
            if (admin && admin.password != undefined) {
                if (admin.password === password) {
                    const updatedAdmin = await Setting.findByIdAndUpdate(
                        admin._id,
                        {
                            password: new_password,
                        },
                        { new: true }
                    );
                    if (!updatedAdmin) {
                        return res
                            .status(400)
                            .json({
                                success: false,
                                message: "Slaptažodis neatnaujintas",
                            });
                    }
                    return res
                        .status(200)
                        .json({
                            success: true,
                            message: "Slaptažodis atnaujintas sėkmingai.",
                        });
                } else {
                    return res
                        .status(400)
                        .json({
                            success: false,
                            message: "Klaidingi slaptažodžio kredencialai",
                        });
                }
            } else {
                const newAdmin = await Setting.create({
                    password: new_password,
                    certificate: ".",
                    contact_email: ".",
                    contact_phone: ".",
                    about_eco_discount_text: ".",
                    warning_text: ".",
                    shipping_bracket: 0,
                    shipping_fees: {},
                });
                if (!newAdmin) {
                    return res
                        .status(400)
                        .json({
                            success: false,
                            message: "Slaptažodis nesukurtas",
                        });
                }
                return res
                    .status(200)
                    .json({
                        success: true,
                        message: "Slaptažodis sukurtas sėkmingai",
                    });
            }
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
        return res
            .status(405)
            .json({ success: false, message: "PUT method is not allowed" });
    } else if (req.method === "DELETE") {
        return res
            .status(405)
            .json({ success: false, message: "DELETE method is not allowed" });
    } else {
        return res.status(200).json({
            success: true,
            message:
                "Hello there, how are you? Since you are here now, maybe reach out to sc0rp10n-py on github or sc0rp10n_py on twitter",
        });
    }
};

export default dbConnect(handler);

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "10mb", // Set the limit to 10mb
        },
    },
};
