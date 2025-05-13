import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        user: {
            type: Object,
            // required: true,
        },
        order_id: {
            type: String,
            // required: true,
        },
        products: {
            type: [Object],
            // required: true,
        },
        quantity: {
            type: Number,
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
        final_price: {
            type: Number,
            // required: true,
        },
        saved: {
            type: Number,
            // required: true,
        },
        delivery_date: {
            type: Date,
            // required: true,
        },
        payment_done: {
            type: Boolean,
            // required: true,
        },
        status: { // pending, shipped, delivered, cancelled
            type: String,
            // required: true,
        },
        delivery_choice: { // mail, courier
            type: String,
            // required: true,
        },
        delivery_address: {
            type: String,
            // required: true,
        },
        pickup_address: {
            type: String,
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

const Order = mongoose.model("Order", orderSchema);

export default Order;