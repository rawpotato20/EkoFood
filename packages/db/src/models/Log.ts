import mongoose, { Schema } from "mongoose";

const logSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            // required: true,
        },
        order: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            // required: true,
        },
        status: { // success, error, warning, info
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        trace: {
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

const Log = mongoose.model("Log", logSchema);

export default Log;