import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === "POST") {
        return res
            .status(405)
            .json({ success: false, message: "POST method is not allowed" });
    } else if (req.method === "GET") {
        const { id } = req.query;
        try {
            const user = await User.findById(id);
            const u = {
                _id: user._id,
                name: user.name,
                last_name: user.last_name,
                email: user.email,
                address: user.address,
                phone: user.phone,
                active_delivery: user.active_delivery,
                payment_card_name: user.payment_card_name,
                payment_card_number: user.payment_card_number,
                payment_connected: user.payment_connected,
                box_id: user.box_id,
                cart_id: user.cart_id,
                created_at: user.created_at,
                updated_at: user.updated_at,
                stripe_customer_id: user.stripe_customer_id,
            };
            return res.status(200).json({ success: true, data: u });
        } catch (error) {
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
