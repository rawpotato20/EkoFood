import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";
import bcrypt from "bcrypt";

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash);
};

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Vartotojas nerastas",
                });
            }
            const match = await comparePassword(password, user.password);
            if (!match) {
                return res.status(401).json({
                    success: false,
                    message: "Neteisingi duomenys",
                });
            }
            // console.log(user);
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
            return res.status(200).json({
                success: true,
                message: "Prisijungėte sėkmingai!",
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
        const { id, password, key, value } = req.body;
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Vartotojas nerastas",
                });
            }
            const match = await comparePassword(password, user.password);
            if (!match) {
                return res.status(401).json({
                    success: false,
                    message: "Neteisingi duomenys",
                });
            }
            const hashedPassword = await hashPassword(value);
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { [key]: hashedPassword },
                { new: true }
            );
            if (!updatedUser) {
                return res.status(400).json({
                    success: false,
                    message: "User not updated",
                });
            }
            return res.status(200).json({
                success: true,
                message: "User updated successfully",
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
