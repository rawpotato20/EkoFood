import Order from "@/models/Order";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === "POST") {
        return res
            .status(405)
            .json({ success: false, message: "POST method is not allowed" });
    } else if (req.method === "GET") {
        try {
            const orders = await Order.find();
            let totalOrders = 0;
            let totalAmount = 0;
            let totalPendingOrders = 0;
            let totalDeliveredOrders = 0;
            orders.forEach((order) => {
                totalOrders += 1;
                totalAmount += order.final_price;
                if (order.status === "pending") {
                    totalPendingOrders += 1;
                } else if (order.status === "delivered") {
                    totalDeliveredOrders += 1;
                }
            });
            const total = {
                totalOrders,
                totalAmount: totalAmount.toFixed(3),
                totalPendingOrders,
                totalDeliveredOrders,
            };
            return res.status(200).json({ success: true, data: total });
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
        return res.status(200).json({
            success: true,
            message:
                "Hello there, how are you? Since you are here now, maybe reach out to sc0rp10n-py on github or sc0rp10n_py on twitter",
        });
    }
};

export default dbConnect(handler);
