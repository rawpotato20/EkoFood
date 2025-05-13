import Log from "@/models/Log";
import Setting from "@/models/Setting";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    const adminPassword = req.headers.authorization ? req.headers.authorization : "";
        try {
            const admin = await Setting.findOne();
            if (admin.password === adminPassword) {
                if (req.method === "POST") {
                    return res
                        .status(405)
                        .json({ success: false, message: "POST method is not allowed" });
                } else if (req.method === "GET") {
                    try {
                        const log = await Log.find({}).sort({ createdAt: -1 });
                        return res.status(200).json({ success: true, data: log });
                    } catch (error) {
                        console.log(error);
                        return res.status(500).json({
                            success: false,
                            message: "Vidinė serverio klaida",
                        });
                    }
                } else if (req.method === "PUT") {
                    return res
                        .status(405)
                        .json({ success: false, message: "PUT method is not allowed" });
                } else if (req.method === "DELETE") {
                    return res
                        .status(405)
                        .json({ success: false, message: "DELETE method is not allowed" });
                } else {
                    return res
                        .status(200)
                        .json({
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
