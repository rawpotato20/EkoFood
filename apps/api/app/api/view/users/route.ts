import User from "@/models/User";
import Setting from "@/models/Setting";
import dbConnect from "@/utils/dbConnect";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

const handler = async (req, res) => {
    if (req.method === "GET") {
        return res
            .status(405)
            .json({ success: false, message: "GET method is not allowed" });
    } else if (req.method === "POST") {
        const { adminPassword } = req.body;
        try {
            const admin = await Setting.findOne();
            if (admin.password === adminPassword) {
                let users = await User.find({}).sort({ name: 1, last_name: 1 }).lean(); // Find all users and sort by name and last_name

                for (let i = 0; i < users.length; i++) {
                    users[i].password = ""; // Clear password for security
            
                    if (users[i].cart_id) {
                        let cart = await Cart.findById(users[i].cart_id).lean(); // Find the cart and use lean()
                        
                        if (cart && cart.quantity > 0 && cart.products.length > 0) {
                            for (let j = 0; j < cart.products.length; j++) {
                                let product = await Product.findById(cart.products[j].product_id)
                                    .select("name image") // Select only the required fields
                                    .lean();
                                if (product) {
                                    cart.products[j].product = product;
                                }
                            }
                        }
            
                        users[i].cart = cart || null; // Assign the cart or null if not found
                    } else {
                        users[i].cart = null; // Assign null if no cart_id
                    }
                }

                // console.log(users);

                return res.status(200).json({ success: true, data: users });
            } else {
                return res
                    .status(400)
                    .json({ success: false, message: "Not Authorized" });
            }
        } catch (error) {
            console.error("Error fetching users:", error);
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
