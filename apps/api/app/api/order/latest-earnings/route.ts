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
            let todayDate = new Date();
            let lastWeek = new Date(
                todayDate.getTime() - 7 * 24 * 60 * 60 * 1000
            );
            let totalAmountForEachDay = [];
            for (let i = 0; i <= 7; i++) {
                let date = new Date(
                    lastWeek.getTime() + i * 24 * 60 * 60 * 1000
                );
                // console.log(date.toDateString());
                let totalAmount = 0;
                orders.forEach((order) => {
                    if (
                        order.created_at.toDateString() === date.toDateString()
                    ) {
                        totalAmount += order.final_price;
                    }
                });
                totalAmountForEachDay.push({
                    date: date.toDateString(),
                    totalAmount: totalAmount.toFixed(3),
                });
            }
            // console.log(totalAmountForEachDay);
            return res
                .status(200)
                .json({ success: true, data: totalAmountForEachDay });
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
