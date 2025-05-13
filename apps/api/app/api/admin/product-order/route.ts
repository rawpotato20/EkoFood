import Product from "@/models/Product";
import Setting from "@/models/Setting";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    const adminPassword = req.headers.authorization ? req.headers.authorization : "";
    try {
        const admin = await Setting.findOne();
        if (admin.password === adminPassword) {
            if (req.method === "POST") {
                const { products } = req.body;
        
                if (!products || !Array.isArray(products)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid products array provided",
                    });
                }
        
                try {
                    // Prepare bulk update operations
                    const bulkOperations = products.map((product, index) => ({
                        updateOne: {
                            filter: { _id: product._id }, // Use product's ID
                            update: { display_order: index }, // Update display_order based on new position
                        },
                    }));
        
                    // Perform bulk write operation
                    await Product.bulkWrite(bulkOperations);
        
                    return res.status(200).json({
                        success: true,
                        message: "Product order updated successfully",
                    });
                } catch (error) {
                    console.error("Error updating product order:", error.message);
                    return res.status(500).json({
                        success: false,
                        message: "Internal Server Error",
                    });
                }
            } else {
                // Handle unsupported methods
                return res.status(405).json({
                    success: false,
                    message: `${req.method} method is not allowed`,
                });
            }
        }
        return res
            .status(400)
            .json({ success: false, message: "Not Authorized" });
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .success({ success: false, message: error.message });
    }
};

export default dbConnect(handler);
