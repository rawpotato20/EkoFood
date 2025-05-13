import mongoose, { Schema } from "mongoose";

const verifySchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        otp: {
            type: Number,
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

const Verify = mongoose.model("Verify", verifySchema);

export default Verify;