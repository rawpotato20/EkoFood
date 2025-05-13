import Setting from "@/models/Setting";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { password } = req.body;
        try {
            const admin = await Setting.findOne();
            if (admin.password === password) {
                return res
                    .status(200)
                    .json({ success: true, message: "Logged In" });
            }
            return res
                .status(400)
                .json({ success: false, message: "Wrong password" });
        } catch (error) {
            console.log(error);
            return res
                .status(400)
                .success({ success: false, message: error.message });
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
