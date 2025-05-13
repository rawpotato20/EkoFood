import Cart from "@/models/Cart";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { user, user_phone,shipping_fee, delivery_provider, delivery_choice, delivery_address, pickup_address } = req.body;
        try {
            const u = await User.findById(user);
            if (!u) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            const cart = await Cart.findById(u.cart_id);
            if (!cart) {
                return res.status(404).json({
                    success: false,
                    message: "Cart not found",
                });
            }
            const updatedCart = await Cart.findByIdAndUpdate(
              cart._id,
              {
                shipping_fee,
                delivery_provider,
                delivery_choice,
                  delivery_address: {
                    ...delivery_address
                },
                  pickup_address: {
                    ...pickup_address
                },
              },
              { new: true }
            );

           const updateUser = await User.findByIdAndUpdate(
                user,
                {
                    phone: user_phone,
                },
                { new: true }
           );
            return res.status(200).json({
                success: true,
                message: "Dėžė sėkmingai atnaujinta.",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    } else if (req.method === "GET") {
        return res
            .status(405)
            .json({ success: false, message: "GET method is not allowed" });
    } else if (req.method === "PUT") {
        const { user, shipping_fee, delivery_provider, delivery_choice, delivery_address, pickup_address } = req.body;
        try {
            const u = await User.findById(user);
            if (!u) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            const cart = await Cart.findById(u.cart_id);
            if (!cart) {
                return res.status(404).json({
                    success: false,
                    message: "Cart not found",
                });
            }
            const updatedCart = await Cart.findByIdAndUpdate(
                cart._id,
                {
                    shipping_fee,
                    delivery_provider,
                    delivery_choice,
                    delivery_address,
                    pickup_address,
                },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                message: "Dėžė sėkmingai atnaujinta.",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    } else if (req.method === "DELETE") {
        return res
            .status(405)
            .json({ success: false, message: "DELETE method is not allowed" });
    } else {
        return res
            .status(200)
            .json({
                success: true,
                message:
                    "Hello there, how are you? Since you are here now, maybe reach out to sc0rp10n-py on github or sc0rp10n_py on twitter",
            });
    }
};

export default dbConnect(handler);
