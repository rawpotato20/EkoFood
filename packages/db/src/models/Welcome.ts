import mongoose, { Schema } from "mongoose";

const welcomeSchema = new Schema(
    {
        heading: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        button_text: {
            type: String,
            required: true,
        },
        button_link: {
            type: String,
            required: true,
        },
        heading2: {
            type: String,
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

const Welcome = mongoose.model("Welcome", welcomeSchema);

export default Welcome;