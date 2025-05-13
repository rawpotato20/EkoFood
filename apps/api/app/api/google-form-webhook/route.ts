import Coupon from "@/models/Coupon";
import User from "@/models/User";
import UserCoupon from "@/models/UserCoupon";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;
    const authHeader = req.headers.authorization;
    const secret = process.env.GOOGLE_FORM_SECRET;

    if (!authHeader || authHeader !== `Bearer ${secret}`) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
  
    const coupon = await Coupon.findOne({ discountType: "freeDelivery" });

    const usercoupon = new UserCoupon({
      user: user._id,
      coupon: coupon._id,
    });

    await usercoupon.save();
    res.status(200).json({ success: true });
  }
}
