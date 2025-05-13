import Cart from "@/models/Cart";
import Product from "@/models/Product";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === "POST") {
        return res
            .status(405)
            .json({ success: false, message: "POST method is not allowed" });
    } else if (req.method === "GET") {
        const { id } = req.query;
        try {
            let cart = await Cart.findById(id);
            if (!cart) {
                return res.status(404).json({
                    success: false,
                    message: "Krepšelis nerastas",
                });
            }
            // console.log(cart);
            if (cart.quantity > 0 && cart.products.length > 0) {
                for (let i = 0; i < cart.products.length; i++) {
                    let product = await Product.findById(cart.products[i].product_id).select(
                        "name image"
                    );
                    // console.log(product);
                    cart.products[i].product = product;
                }
            }
            // console.log(cart);
            return res.status(200).json({ success: true, data: cart });
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
