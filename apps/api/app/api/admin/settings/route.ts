import Setting from "@/models/Setting";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    const adminPassword = req.headers.authorization ? req.headers.authorization : "";
    try {
        const admin = await Setting.findOne();
        if (admin.password === adminPassword) {
            if (req.method === "POST") {
                const {
                  certificate,
                  contact_email,
                  contact_phone,
                  about_eco_discount_text,
                  warning_text,
                  login_text,
                  shipping_bracket,
                  shipping_fees,
                  about_page_content,
                  ads_title,
                } = req.body;
                try {
                    if (
                        !certificate ||
                        !contact_email ||
                        !contact_phone ||
                        !about_eco_discount_text ||
                        !warning_text ||
                        !login_text ||
                        !shipping_bracket ||
                        !shipping_fees ||
                        !about_page_content ||
                        !ads_title
                    ) {
                        return res.status(400).json({
                            success: false,
                            message: "All fields are required",
                        });
                    }
                    const setting = await Setting.findOne({});
                    if (setting) {
                        const updatedSetting = await Setting.findByIdAndUpdate(
                          setting._id,
                          {
                            certificate,
                            contact_email,
                            contact_phone,
                            about_eco_discount_text,
                            warning_text,
                            login_text,
                            shipping_bracket,
                            shipping_fees,
                              about_page_content,
                                ads_title,
                          },
                          { new: true }
                        );
                        if (!updatedSetting) {
                            return res.status(400).json({
                                success: false,
                                message: "Settings could not be updated",
                            });
                        }
                        return res.status(200).json({
                            success: true,
                            message: "Settings updated successfully",
                        });
                    } else {
                        const newSetting = await Setting.create({
                          certificate,
                          contact_email,
                          contact_phone,
                          about_eco_discount_text,
                          warning_text,
                          login_text,
                          shipping_bracket,
                          shipping_fees,
                            about_page_content,
                            ads_title,
                        });
                        if (!newSetting) {
                            return res.status(400).json({
                                success: false,
                                message: "Settings could not be updated",
                            });
                        }
                        return res.status(200).json({
                            success: true,
                            message: "Settings updated successfully",
                        });
                    }
                } catch (error) {
                    console.log(error);
                    return res
                        .status(500)
                        .json({ success: false, message: "Vidinė serverio klaida" });
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
