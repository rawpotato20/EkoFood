import Box from "@/models/Box";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    host: "smtp.hostinger.com",
    port: 465,
    secure: true, // use false for STARTTLS; true for SSL on port 465
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
    },
});

const generateOrderID = (id) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    // console.log("id", id);
    let result = id.substring(0, 5);
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { id } = req.body;
        try {
            const user = await User.findById(id);
            const user2 = await User.findById(id).select(
                "name email phone address stripe_customer_id"
            );
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
            let products = [];
            for (let i = 0; i < cart.products.length; i++) {
                const product = await Product.findById(cart.products[i].product_id).select(
                    "name image"
                );
                products.push(product);
            }
            if (!user.active_delivery) {
                return res.status(400).json({
                    success: false,
                    message: "Vartotojas neaktyvino pristatymo",
                });
            }

            let updateCart;
            const next_date = new Date(cart.next_delivery);
            const last_date = new Date(cart.last_delivery);
            const today = new Date();

            if ((next_date - today) / (1000 * 60 * 60 * 24) <= 8) {
                const order = await Order.create({
                    user: user2,
                    order_id: generateOrderID(id),
                    products: products,
                    quantity: cart.quantity,
                    original_price: cart.original_price,
                    discount: cart.discount,
                    final_price: cart.final_price,
                    saved: cart.saved,
                    delivery_date: cart.next_delivery,
                    payment_done: false,
                    status: "pending",
                });

                const updateUser = await User.findByIdAndUpdate(
                    user._id,
                    {
                        orders: [...user.orders, order._id],
                    },
                    { new: true }
                );

            
                const hasFreeProducts = cart.products.some(p => p.is_free_product === true);

                if (hasFreeProducts) {
                  await User.findByIdAndUpdate(
                    user._id,
                    { free_product_activated: true },
                    { new: true }
                  );
                }

                const mailOptions = {
                    from: process.env.MAIL,
                    to: process.env.MAIL,
                    subject: "New Order Received from " + user.name,
                    html:
                        "<p>New Order Received from " +
                        user.name +
                        " with email " +
                        user.email +
                        " and address " +
                        user.address +
                        " with order id " +
                        order._id +
                        "</p>",
                    text:
                        "New Order Received from " +
                        user.name +
                        " with email " +
                        user.email +
                        " and address " +
                        user.address +
                        " with order id " +
                        order._id,
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log("Error:", error);
                        return res.status(500).json({
                            success: false,
                            message: "Error sending email",
                        });
                    } else {
                        console.log("Email sent: ", info.response);
                    }
                });

                return res.status(200).json({
                    success: true,
                    message: "Užsakymas sukurtas",
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Per anksti pateikti užsakymą",
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
    } else if (req.method === "PUT") {
        const { id } = req.body;
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Vartotojas nerastas",
                });
            }
            const updateUser = await User.findByIdAndUpdate(
                user._id,
                { active_delivery: false },
                { new: true }
            );
            const updateBox = await Box.findByIdAndUpdate(
                user.box_id,
                { current_box_status: false },
                { new: true }
            );
            const updateOrder = await Order.findByIdAndUpdate(
                user.orders[user.orders.length - 1],
                {
                    status: "cancelled",
                },
                { new: true }
            );

            const mailOptions = {
                from: process.env.MAIL,
                to: process.env.MAIL,
                subject:
                    "Order Cancelled | Order ID: " +
                    user.orders[user.orders.length - 1],
                html:
                    "<p>Order with ID " +
                    user.orders[user.orders.length - 1] +
                    " has been cancelled.</p>",
                text:
                    "Order with ID " +
                    user.orders[user.orders.length - 1] +
                    " has been cancelled.",
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("Error:", error);
                } else {
                    console.log("Email sent: ", info.response);
                }
            });

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
            return res.status(200).json({
                success: true,
                message: "Dėžutės būsena atnaujinta",
                data: u,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Vidinė serverio klaida",
            });
        }
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
