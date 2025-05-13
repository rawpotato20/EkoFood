import mongoose, { Schema } from "mongoose";

const userCouponSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon", required: true },
    used: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

mongoose.models = {};

const UserCoupon = mongoose.model("UserCoupon", userCouponSchema);

export default UserCoupon;
