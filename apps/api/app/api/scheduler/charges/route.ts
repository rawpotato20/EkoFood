import Log from "@/models/Log";
import Order from "@/models/Order";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === "POST") {
        try {
            const orders = await Order.find({});
            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];

                const deliveryDate = order.delivery_date;
                const currentDate = new Date();

                const differenceInDays = Math.floor(
                    (deliveryDate - currentDate) / (1000 * 60 * 60 * 24)
                );

                if (differenceInDays <= 5) {
                    const ress = await fetch(process.env.WEB_URL + "/api/order/charge-user", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id: order._id }),
                    }).then((ress) => ress.json());
                    if (ress.success) {
                        const log = await Log.create({
                            order: order._id,
                            status: "success",
                            message: "Charge created for " + order.order_id,
                            trace: ress.message,
                        });
                    } else {
                        const log = await Log.create({
                            order: order._id,
                            status: "error",
                            message: "Charge Error for " + order.order_id,
                            trace: ress.message,
                        });
                    }
                }
            }
        } catch (error) {
            console.log(error);
            const log = await Log.create({
                status: "error",
                message: "Charge Error",
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
