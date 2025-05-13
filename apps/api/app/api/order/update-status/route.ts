import Cart from "@/models/Cart";
import Order from "@/models/Order";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === "POST") {
        return res
            .status(405)
            .json({ success: false, message: "POST method is not allowed" });
    } else if (req.method === "PUT") {
        const { id, status } = req.body;
        try {
            const orders = await Order.findById(id);
            if (!orders) {
                return res.status(404).json({
                    success: false,
                    message: "Užsakymas nerastas",
                });
            }
            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );
            if (status === "delivered") {
                const user = await User.findById(orders.user._id);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: "Vartotojas nerastas",
                    });
                }
                const cart = await Cart.findById(user.cart_id);
                if (!cart) {
                    return res.status(404).json({
                        success: false,
                        message: "Krepšelis nerastas",
                    });
                }
                const updateCart = await Cart.findByIdAndUpdate(
                    cart._id,
                    {
                        last_delivery: cart.next_delivery,
                        next_delivery: new Date(
                            Date.now() + 30 * 24 * 60 * 60 * 1000
                        ),
                    },
                    {
                        new: true,
                    }
                );
            }
            return res.status(200).json({ success: true, data: updatedOrder });
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
