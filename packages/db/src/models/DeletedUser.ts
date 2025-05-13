import mongoose, { Schema } from "mongoose";

const deletedUserSchema = new Schema(
    {
        id: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        payment: {
            type: String,
            required: false,
            default: "empty",
        },
        address: {
            type: String,
            required: false,
            default: ".",
        },
        active_delivery: {
            type: Boolean,
            required: true,
            default: false,
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
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

mongoose.models = {};

const DeletedUser = mongoose.model("DeletedUser", deletedUserSchema);

export default DeletedUser;
