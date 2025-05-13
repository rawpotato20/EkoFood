import Coupon from "@/models/Coupon";
import UserCoupon from "@/models/UserCoupon";
import dbConnect from "@/utils/dbConnect";


const handler = async (req, res) => {
    if (req.method === "POST") {
        return res
            .status(405)
            .json({ success: false, message: "POST method is not allowed" });
    } else if (req.method === "GET") {
        const { id } = req.query;
        try {
            if(!id){
                return res.status(400).json({
                  success: false,
                  message: "Būtinas ID",
                });
            }
            console.log(await Coupon.find())
            const coupons = await UserCoupon.find({ user: id, used: false }).populate("coupon");
            if (!coupons) {
                return res.status(404).json({
                    success: false,
                    message: "Kuponai nerasti",
                });
            } else {
                return res.status(200).json({ success: true, data: coupons });
            }
            

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Vidinė serverio klaida",
            });
        }
        return res.status(200).json({
            success: true,
            message:
                "Hello there, how are you? Since you are here now, maybe reach out to sc0rp10n-py on github or sc0rp10n_py on twitter",
        });
    } else if (req.method === "PUT") {
        return res
            .status(405)
            .json({ success: false, message: "PUT method is not allowed" });
    } else if (req.method === "DELETE") {
        return res
            .status(405)
            .json({ success: false, message: "DELETE method is not allowed" });
    } 
}

export default dbConnect(handler);