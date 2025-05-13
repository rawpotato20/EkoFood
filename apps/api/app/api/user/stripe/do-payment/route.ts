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
            const box = await Box.findById(user.box_id);
            const paymentIntent = await stripe.paymentIntents.create({
                // amount: Math.round(box.current_box_final_price),
                // amount: Number(box.current_box_final_price).toFixed(2) * 100,
                amount: 0.5 * 100,
                currency: "eur",
                customer: user.stripe_customer_id,
                payment_method: user.payment,
                off_session: true,
                confirm: true,
            });
            // console.log(paymentIntent);
            return res.status(200).json({
                success: true,
                data: paymentIntent,
            });
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
