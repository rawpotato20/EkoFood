import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { userId } = req.body;
        try {
            const user = await User.findById(userId).select(
                "name email address"
            );
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Vartotojas nerastas",
                });
            }
            return res.status(200).json({ success: true, data: user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Vidinė serverio klaida",
            });
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
