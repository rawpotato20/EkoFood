import Box from "@/models/Box";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";


const handler = async (req, res) => {
    if (req.method === "POST") {
        const { id } = req.body;
        try {
            const user = await User.findById(id);
            const user2 = await User.findById(id).select(
                "name email address stripe_customer_id"
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
                    "name image price"
                );
                products.push(product);
            }
            

            const updateUser = await User.findByIdAndUpdate(
                user._id,
                {
                    active_delivery: true,
                    activated_within_24_hours: user.created_at && (new Date() - user.created_at) <= 24 * 60 * 60 * 1000,
                },
                { new: true }
            );
            const updateBox = await Box.findByIdAndUpdate(
                user.box_id,
                { current_box_status: true },
                { new: true }
            );

            let updateCart;
            if (!cart.next_delivery) {
                if (cart.last_delivery === "" || !cart.last_delivery) {
                    updateCart = await Cart.findByIdAndUpdate(
                        user.cart_id,
                        {
                            // last_delivery: new Date(
                            //     Date.now() + 30 * 24 * 60 * 60 * 1000
                            // ),
                            next_delivery: new Date(
                                Date.now() + 30 * 24 * 60 * 60 * 1000
                            ),
                        },
                        { new: true }
                    );
                } else {
                    updateCart = await Cart.findByIdAndUpdate(
                        user.cart_id,
                        {
                            last_delivery: cart.next_delivery,
                            next_delivery: new Date(
                                Date.now() + 30 * 24 * 60 * 60 * 1000
                            ),
                        },
                        { new: true }
                    );
                }
            } else if (cart.next_delivery < new Date()) {
                if (cart.last_delivery === "" || !cart.last_delivery) {
                    updateCart = await Cart.findByIdAndUpdate(
                        user.cart_id,
                        {
                            // last_delivery: new Date(
                            //     Date.now() + 30 * 24 * 60 * 60 * 1000
                            // ),
                            next_delivery: new Date(
                                Date.now() + 30 * 24 * 60 * 60 * 1000
                            ),
                        },
                        { new: true }
                    );
                } else {
                    updateCart = await Cart.findByIdAndUpdate(
                        user.cart_id,
                        {
                            last_delivery: cart.next_delivery,
                            next_delivery: new Date(
                                Date.now() + 30 * 24 * 60 * 60 * 1000
                            ),
                        },
                        { new: true }
                    );
                }
            }

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
