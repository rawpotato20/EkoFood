import Box from "@/models/Box";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Setting from "@/models/Setting";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    await dbConnect();  // Ensure DB connection is established

    if (req.method === "PUT") {
        const { id, id2, id3, price, volume, out_of_stock } = req.body;
        try {
            let discount = 0;

            const settings = await Setting.findOne();

            // Get the cart by id
            const cart = await Cart.findById(id);
            if (!cart) {
                return res.status(400).json({
                    success: false,
                    message: "Cart not found",
                });
            }

            // Set discount based on quantity
            // if (cart.quantity > 15) discount = 10;
            // else if (cart.quantity > 10) discount = 5;
            // else if (cart.quantity > 5) discount = 2.5;

            // Get product by id3
            const product = await Product.findById(id3);
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: "Product not found",
                });
            }

            const originalProductPrice = Number(price) || 0;
            const discountedProductPrice = originalProductPrice - (originalProductPrice * discount) / 100;

            // get current cart
            const quantity = cart.quantity || 0;
            const original_price = cart.original_price || 0;
            const final_price = cart.final_price || 0;
            const saved = cart.saved || 0;

            // Update cart information
            const newQuantity = quantity + 1;
            const newOriginalPrice = original_price + originalProductPrice;
            let shipping = cart.shipping_fee || 0;
            // console.log("shipping", shipping);
            let newFinalPrice = final_price + discountedProductPrice;
            // console.log("newFinalPrice", newFinalPrice);
            if (newFinalPrice >= settings.shipping_bracket) {
                newFinalPrice -= shipping;
                shipping = 0;
            } else {
                newFinalPrice += shipping;
            }

            const newSaved = saved + (originalProductPrice - discountedProductPrice);

            let products = cart.products || [];

            // Check if the product exists in the cart
            const existingProductIndex = products.findIndex(
                (p) => p.product_id.toString() === id3.toString() && p.volume === volume
            );

            if (existingProductIndex > -1) {
                products[existingProductIndex].quantity += 1;
            } else {
                products.push({
                    product_id: id3,
                    quantity: 1,
                    price: price,
                    volume: volume,
                    out_of_stock: out_of_stock,
                });
            }

            // Update box
            const box = await Box.findById(id2);
            if (!box) {
                return res.status(400).json({
                    success: false,
                    message: "Box not found",
                });
            }

            await Box.findByIdAndUpdate(
                id2,
                {
                    current_box_price: newOriginalPrice,
                    current_box_discount: discount,
                    current_box_final_price: newFinalPrice,
                },
                { new: true }
            );

            // Update the cart in the database
            const updatedCart = await Cart.findByIdAndUpdate(
                id,
                {
                    quantity: newQuantity,
                    original_price: newOriginalPrice,
                    final_price: newFinalPrice,
                    shipping_fee: shipping,
                    discount,
                    saved: newSaved,
                    products,
                },
                { new: true }
            );

            if (!updatedCart) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to update the cart",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Dėžė atsinaujino",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    } else if (req.method === "DELETE") {
        const { id, id2, id3, price, volume } = req.body;
        try {
            let discount = 0;

            const settings = await Setting.findOne();

            // Get the cart by id
            const cart = await Cart.findById(id);
            if (!cart) {
                return res.status(400).json({
                    success: false,
                    message: "Cart not found",
                });
            }

            // Set discount based on quantity
            // if (cart.quantity > 15) discount = 10;
            // else if (cart.quantity > 10) discount = 5;
            // else if (cart.quantity > 5) discount = 2.5;

            // Get product by id3
            const product = await Product.findById(id3);
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: "Product not found",
                });
            }

            const originalProductPrice = Number(price) || 0;
            const discountedProductPrice = originalProductPrice - (originalProductPrice * discount) / 100;

            // get current cart
            const quantity = cart.quantity || 0;
            const original_price = cart.original_price || 0;
            const final_price = cart.final_price || 0;
            const saved = cart.saved || 0;

            // Decrement cart quantity and ensure it doesn't go below zero
            let newQuantity = quantity - 1;
            newQuantity = Math.max(newQuantity, 0);

            // Decrement original and final prices, and ensure they don't go below zero
            let newOriginalPrice = original_price - originalProductPrice;
            newOriginalPrice = Math.max(newOriginalPrice, 0);

            let shipping = cart.shipping_fee || 0;
            let newFinalPrice = final_price - discountedProductPrice + shipping;
            if (newFinalPrice >= settings.shipping_bracket) {
                newFinalPrice -= shipping;
                shipping = 0;
            } else {
                shipping = settings.shipping_fees[cart.delivery_provider][cart.delivery_choice];
                newFinalPrice += shipping;
            }
            newFinalPrice = Math.max(newFinalPrice, 0);

            let newSaved = saved - (originalProductPrice - discountedProductPrice);
            newSaved = Math.max(newSaved, 0);

            let products = cart.products;

            // Check if the product exists in the cart
            const existingProductIndex = products.findIndex(
                (p) => p.product_id.toString() === id3.toString() && p.volume === volume
            );

            if (existingProductIndex > -1) {
                if (products[existingProductIndex].quantity > 1) {
                    // Reduce product quantity
                    products[existingProductIndex].quantity -= 1;
                } else {
                    // Remove product from cart if the quantity becomes zero
                    products.splice(existingProductIndex, 1);
                }
            }

            // Check if cart is empty after the product deletion
            if (newQuantity === 0) {
                newOriginalPrice = 0;
                newFinalPrice = 0;
                newSaved = 0;
            }

            // Update box prices
            const box = await Box.findById(id2);
            if (!box) {
                return res.status(400).json({
                    success: false,
                    message: "Box not found",
                });
            }

            await Box.findByIdAndUpdate(
                id2,
                {
                    current_box_price: newOriginalPrice,
                    current_box_discount: discount,
                    current_box_final_price: newFinalPrice,
                },
                { new: true }
            );

            // Update the cart in the database
            const updatedCart = await Cart.findByIdAndUpdate(
                id,
                {
                    quantity: newQuantity,
                    original_price: newOriginalPrice,
                    final_price: newFinalPrice,
                    shipping_fee: shipping,
                    discount,
                    saved: newSaved,
                    products,
                },
                { new: true }
            );

            if (!updatedCart) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to update the cart",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Dėžė atsinaujino",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }
    else {
        return res.status(200).json({
            success: true,
            message:
                "Hello there, how are you? Since you are here now, maybe reach out to sc0rp10n-py on github or sc0rp10n_py on twitter",
        });
    }
};

export default dbConnect(handler);
