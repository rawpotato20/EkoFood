import Log from "@/models/Log";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === "POST") {
        try {
            const users = await User.find({});
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                if (user.active_delivery) {
                    const ress = await fetch(process.env.WEB_URL + "/api/user/order", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id: user._id }),
                    }).then((ress) => ress.json());
                    if (ress.success) {
                        const log = await Log.create({
                            user: user._id,
                            status: "success",
                            message: "Užsakymas sukurtas for " + user.name,
                            trace: ress.message,
                        });
                    } else {
                        const log = await Log.create({
                            user: user._id,
                            status: "error",
                            message: "Order Error for " + user.name,
                            trace: ress.message,
                        });
                    }
                }
            }
        } catch (error) {
            console.log(error);
            const log = await Log.create({
                status: "error",
                message: "Order Error",
                trace: error,
            });
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
        return res
            .status(200)
            .json({
                success: true,
                message:
                    "Hello there, how are you? Since you are here now, maybe reach out to sc0rp10n-py on github or sc0rp10n_py on twitter",
            });
    }
};

export default dbConnect(handler);
