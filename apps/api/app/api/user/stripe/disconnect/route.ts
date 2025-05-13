import Box from "@/models/Box";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { id } = req.body;
        try {
            const user = await User.findById(id);
            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, message: "Vartotojas nerastas" });
            }
            if (user.payment_connected === false) {
                return res.status(400).json({
                    success: false,
                    message: "Vartotojas neprijungė mokėjimo",
                });
            }
            const paymentMethod = await stripe.paymentMethods.detach(
                user.payment
            );
            const updateUser = await User.findByIdAndUpdate(
                user._id,
                {
                    payment_card_name: "",
                    payment_card_number: "",
                    payment: "",
                    payment_connected: false,
                },
                { new: true }
            );
            const u = {
                _id: updateUser._id,
                name: updateUser.name,
                last_name: updateUser.last_name,
                email: updateUser.email,
                address: updateUser.address,
                phone: updateUser.phone,
                active_delivery: updateUser.active_delivery,
                payment_card_name: updateUser.payment_card_name,
                payment_card_number: updateUser.payment_card_number,
                payment_connected: updateUser.payment_connected,
                box_id: updateUser.box_id,
                cart_id: updateUser.cart_id,
                created_at: updateUser.created_at,
                updated_at: updateUser.updated_at,
                stripe_customer_id: updateUser.stripe_customer_id,
            };
            return res.status(200).json({ success: true, data: u, message: "Sėkmingai atjungta" });
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
};

export default dbConnect(handler);
