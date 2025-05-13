import Box from "@/models/Box";
import Cart from "@/models/Cart";
import DeletedUser from "@/models/DeletedUser";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";
import bcrypt from "bcrypt";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash);
};

const handler = async (req, res) => {
    if (req.method === "POST") {
        return res
            .status(405)
            .json({ success: false, message: "POST method is not allowed" });
    } else if (req.method === "GET") {
        return res
            .status(405)
            .json({ success: false, message: "GET method is not allowed" });
    } else if (req.method === "PUT") {
        const { email, password } = req.body;
        try {
            const hashedPassword = await hashPassword(password);
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Vartotojas nerastas",
                });
            }
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { password: hashedPassword },
                { new: true }
            );
            // console.log(updatedUser);
            if (!updatedUser) {
                return res.status(400).json({
                    success: false,
                    message: "Vartotojas neatnaujintas",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Slaptažodis atnaujintas sėkmingai.",
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
