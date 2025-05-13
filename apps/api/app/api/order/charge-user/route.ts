import Order from "@/models/Order";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
    if (req.method === "PUT") {
        return res
            .status(405)
            .json({ success: false, message: "PUT method is not allowed" });
    } else if (req.method === "POST") {
        const { id } = req.body;
        try {
            const order = await Order.findById(id);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Užsakymas nerastas",
                });
            }

            const deliveryDate = order.delivery_date;
            const currentDate = new Date();

            const differenceInDays = Math.floor(
                (deliveryDate - currentDate) / (1000 * 60 * 60 * 24)
            );

            if (differenceInDays <= 7) {
                if (order.status === "cancelled") {
                    return res.status(400).json({
                        success: false,
                        message: "Order has been cancelled, you cannot charge",
                    });
                } else {
                    const user = await User.findById(order.user._id);
                    if (!user) {
                        return res.status(404).json({
                            success: false,
                            message: "Vartotojas nerastas",
                        });
                    }
                    if (user.payment_connected) {
                        return res.status(404).json({
                            success: false,
                            message: "Vartotojas neprijungė mokėjimo",
                        });
                    }

                    const userCreationDate = new Date(user.created_at);
                    const currentDate = new Date();
                    
                    
                    const oneMonthAfterCreation = new Date(userCreationDate);
                    oneMonthAfterCreation.setMonth(userCreationDate.getMonth() + 1);

                    
                    if (currentDate < oneMonthAfterCreation) {
                        
                        const hasReceivedDiscount =
                          user.first_order_discount_received;

                        let finalPrice = Number(order.final_price);
                        let discountApplied = false;

                    
                        if (!hasReceivedDiscount) {
                            finalPrice -= (10 * finalPrice / 100);
                            discountApplied = true;
                        }

                        const paymentIntent = await stripe.paymentIntents.create({
                            amount: Math.round(finalPrice * 100), 
                            currency: "eur",
                            customer: user.stripe_customer_id,
                            payment_method: user.payment,
                            off_session: true,
                            confirm: true,
                            metadata: {
                                first_order_discount: discountApplied ? '10%' : 'none'
                            }
                        });

                        if (paymentIntent.status === "succeeded") {
                            const updatedOrder = await Order.findByIdAndUpdate(
                                id,
                                { 
                                    payment_done: true,
                                    first_order_discount: discountApplied
                                },
                                { new: true }
                            );
                            if (!hasReceivedDiscount) {
                                const updatedUser =
                                  await User.findByIdAndUpdate(
                                    order.user._id,
                                    {
                                      first_order_discount_received: true,
                                    },
                                    { new: true }
                                  );
                            }

                            return res.status(200).json({
                                success: true,
                                data: updatedOrder,
                                message: discountApplied 
                                    ? "Mokėjimas sėkmingas (10% nuolaida taikyta)" 
                                    : "Mokėjimas sėkmingas",
                            });
                        } else {
                            return res.status(400).json({
                                success: false,
                                message: "Mokėjimas nepavyko",
                            });
                        }
                    } else {
                        const paymentIntent = await stripe.paymentIntents.create({
                            amount: Number(order.final_price).toFixed(2) * 100,
                            currency: "eur",
                            customer: user.stripe_customer_id,
                            payment_method: user.payment,
                            off_session: true,
                            confirm: true,
                        });
                        if (paymentIntent.status === "succeeded") {
                            const updatedOrder = await Order.findByIdAndUpdate(
                                id,
                                { payment_done: true },
                                { new: true }
                            );

                            return res.status(200).json({
                                success: true,
                                data: updatedOrder,
                                message: "Mokėjimas sėkmingas",
                            });
                        } else {
                            return res.status(400).json({
                                success: false,
                                message: "Mokėjimas nepavyko",
                            });
                        }
                    }
                }
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Šiuo metu negalima apmokestinti vartotojo",
                });
            }
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
