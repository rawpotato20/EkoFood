// pages/api/subscribe-newsletter/[token].js
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import UserCoupon from "@/models/UserCoupon";
import Coupon from "@/models/Coupon";
import User from "@/models/User";

export default async function handler(req, res) {
  const { token } = req.query;

  const [userId, signature] = token.split(".");
  const expectedSign = crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(userId)
    .digest("hex");

  if (signature !== expectedSign) {
    return res.redirect("/subscription-error?code=invalid_token");
  }

  try {
    const existinguser = await User.findById(userId);

    if (!existinguser)
      return res.redirect("/subscription-error?code=user_not_found");
    if (existinguser.newsletter_subscribed) {
      return res.redirect("/already-subscribed");
    }
    await User.updateOne(
      { _id: existinguser._id },
      { newsletter_subscribed: true }
    );

    const couponCode = await Coupon.findOne({ couponType: "discount" });
    if (!couponCode)
      return res.redirect("/subscription-error?code=coupon_not_found");

    await UserCoupon.create({
      user: existinguser._id,
      coupon: couponCode._id,
    });

    res.redirect(
      `/subscription-success?code=${encodeURIComponent(couponCode.name)}`
    );
  } catch (error) {
    console.log("error---------------------", error);
    res.redirect("/subscription-error?code=server_error");
  }
}
