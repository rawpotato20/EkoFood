import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      required: true,
    },
    payment: {
      type: String,
      required: true,
      default: "empty",
    },
    address: {
      type: String,
      required: true,
      default: ".",
    },
    active_delivery: {
      type: Boolean,
      required: true,
      default: false,
    },
    payment_card_name: {
      type: String,
    },
    payment_card_number: {
      type: String,
    },
    payment_connected: {
      type: Boolean,
      required: true,
      default: false,
    },
    box_id: {
      type: Schema.Types.ObjectId,
      ref: "Box",
    },
    cart_id: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    },
    stripe_customer_id: {
      type: String,
    },
    orders: {
      type: [Schema.Types.ObjectId],
      ref: "Order",
    },
    newsletter_subscribed: {
      type: Boolean,
      default: false,
    },
    connected_with_listmonk: {
      type: Boolean,
      default: false,
    },
    listmonk_subscriber_id: {
      type: Number,
      required: false,
    },
    first_order_discount_received: {
      type: Boolean,
      default: false,
    },
    activate_in_24_hours: {
      type: Boolean,
      default: false,
    },
    free_product_activated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

mongoose.models = {};

const User = mongoose.model("User", userSchema);

export default User;
