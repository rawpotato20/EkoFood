import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
  {
    quantity: {
      type: Number,
      // required: true,
    },
    last_delivery: {
      type: Date,
      // required: true,
    },
    next_delivery: {
      type: Date,
      // required: true,
    },
    original_price: {
      type: Number,
      // required: true,
    },
    discount: {
      type: Number,
      // required: true,
    },
    shipping_fee: {
      type: Number,
      // required: true,
    },
    final_price: {
      type: Number,
      // required: true,
    },
    saved: {
      type: Number,
      // required: true,
    },
    products: {
      type: [Object],
      // required: true,
      default: [],
      // default: [{
      //     product_id: {
      //         type: Schema.Types.ObjectId,
      //         ref: "Product",
      //         // required: true,
      //     },
      //     volume: {
      //         type: Number,
      //         // required: true,
      //     },
      //     price: {
      //         type: Number,
      //         // required: true,
      //     },
      //     out_of_stock: {
      //         type: Boolean,
      //         // required: true,
      //     },
      //     quantity: {
      //         type: Number,
      //         // required: true,
      //     },
      // }],
    },
    free_product: {
      type: Object, 
      default: null,
    },
    delivery_provider: {
      type: String,
      // required: true,
    },
    delivery_choice: {
      // mail, courier
      type: String,
      // required: true,
    },
    delivery_address: {
      type: Object,
      // required: true,
    },
    pickup_address: {
      type: Object,
      // required: true,
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

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
