import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
  {
    name: { type: String, unique: true },
    couponType: { type: String, enum: ["discount", "free-delivery"] },
    percentage: { type: Number, nullable: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

mongoose.models = {};

const Coupon = mongoose.Coupon || mongoose.model("Coupon", couponSchema);

export default Coupon;
