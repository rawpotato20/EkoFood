import mongoose, { Schema } from "mongoose";

const trackingSchema = new Schema(
    {
        link: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        time: {
            type: Date,
            required: true,
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

const Tracking = mongoose.model("Tracking", trackingSchema);

export default Tracking;