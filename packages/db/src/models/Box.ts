import mongoose, { Schema } from "mongoose";

const boxSchema = new Schema(
    {
        current_box_price: {
            type: Number,
            // required: true,
        },
        current_box_discount: {
            type: Number,
            // required: true,
        },
        current_box_status: {
            type: String,
            // required: true,
        },
        current_box_final_price: {
            type: Number,
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

const Box = mongoose.model("Box", boxSchema);

export default Box;