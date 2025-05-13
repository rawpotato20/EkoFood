import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { id, email } = req.body;
        try {
            // console.log(id);
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "setup",
                success_url: `${process.env.WEB_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.WEB_URL}/cancel`,
                // customer_email: email,
                customer: id,
            });
            // console.log("session", session);
            return res
                .status(200)
                .json({ success: true, sessionId: session.id });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Vidinė serverio klaida",
            });
        }
    } else if (req.method === "GET") {
        const { session_id } = req.query;
        try {
            const session = await stripe.checkout.sessions.retrieve(session_id);
            const setupIntent = await stripe.setupIntents.retrieve(
                session.setup_intent
            );
            // console.log("setupIntent", setupIntent);
            const payment_methods = await stripe.customers.listPaymentMethods(
                setupIntent.customer,
                {
                    limit: 1,
                }
            );
            const user = await User.findOne({ stripe_customer_id: setupIntent.customer });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Vartotojas nerastas",
                });
            }
            const updateUser = await User.findOneAndUpdate(
                { _id: user._id },
                {
                    payment_card_name: payment_methods.data[0].card.brand,
                    payment_card_number: payment_methods.data[0].card.last4,
                    payment: setupIntent.payment_method,
                    payment_connected: true,
                },
                { new: true }
            );
            const u = {
                _id: updateUser._id,
                name: updateUser.name,
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
            return res.status(200).json({ success: true, data: u });
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
