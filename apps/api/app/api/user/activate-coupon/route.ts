import Box from "@/models/Box";
import Cart from "@/models/Cart";
import User from "@/models/User";
import UserCoupon from "@/models/UserCoupon"
import Coupon from "@/models/Coupon"
import dbConnect from "@/utils/dbConnect";



const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { couponId, userId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Vartotojas nerastas" });
      }
      const coupon = await Coupon.findById(couponId);
     

      if (!coupon) {
        return res
          .status(404)
          .json({ success: false, message: "Kuponas nerastas" });
      }
      const box = await Box.findById(user.box_id);

      if (!box || !box.current_box_final_price)
        return res.status(404).json({
          success: false,
          message: "Kuponai tuščiam krepšeliui nenaudojami.",
        });
      
      const userCoupon = await UserCoupon.findOne({
        user: userId,
        coupon: coupon
      })
      
      if (!userCoupon) {
        return res
          .status(404)
          .json({ success: false, message: "User coupon not found" });
      }

      const finalPrice =
        box.current_box_final_price -
        (box.current_box_final_price * coupon.percentage) / 100;
      
      const discount = (box.current_box_final_price * coupon.percentage) / 100;

     const updatedBoc = await Box.findByIdAndUpdate(user.box_id, {
       current_box_discount: discount,
       current_box_final_price: finalPrice,
       current_box_price: finalPrice,
     });

      const updateduser = await User.findByIdAndUpdate(userId, { final_price : finalPrice });
      const updatedCart = await Cart.findByIdAndUpdate(updateduser.cart_id, {
        original_price: finalPrice,
        final_price : finalPrice
      });
      
       
      const userCouponupdate  = await UserCoupon.findOneAndUpdate(
        { user: userId, coupon: couponId },
        { used: true }
      );

      
      return res
        .status(200)
        .json({ success: true, message: "Coupon activated" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
};

export default dbConnect(handler);
