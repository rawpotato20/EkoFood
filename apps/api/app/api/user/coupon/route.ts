import Coupon from "@/models/Coupon";
import UserCoupon from "@/models/UserCoupon";
import dbConnect from "@/utils/dbConnect";


const handler = async (req, res) => {
    if (req.method === "POST") {
        const { coupon ,user_id} = req.body;
        if(!coupon){
            return res.status(400).json({
              success: false,
              message: "Būtinas kuponas",
            });
        }
        const couponExist = await Coupon.findOne({ name: coupon });
        if (!couponExist) {
            return res.status(404).json({
                success: false,
                message: "Kuponas nerastas",
            });
        }
        const userCouponExist = await UserCoupon.findOne({ coupon: couponExist._id ,user : user_id});
        
        if (userCouponExist && userCouponExist.used) {
            return res.status(400).json({
                success: false,
                message: "Kuponas jau naudotas",
            });
        } else if (userCouponExist && !userCouponExist.used) {
            return res.status(200).json({
              success: true,
              message: "Kuponas jau pridėtas",
              data: couponExist,
            });
        } else {
            return res.status(404).json({
              success: false,
              message: "Kuponas nerastas",
            });
        }
      
    } else if (req.method === "GET") {
        return res
            .status(405)
            .json({ success: false, message: "GET method is not allowed" });
    } else if (req.method === "PUT") {
        return res
            .status(405)
            .json({ success: false, message: "PUT method is not allowed" });
    } else if (req.method === "DELETE") {
        return res
            .status(405)
            .json({ success: false, message: "DELETE method is not allowed" });
    } 
};

export default dbConnect(handler);
