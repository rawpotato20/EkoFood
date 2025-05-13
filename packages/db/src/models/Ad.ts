import mongoose, { Schema } from "mongoose";

const adSchema = new Schema(
    {
        background: {
            type: String,
            required: true,
        },
        background2: {
            type: String,
            required: true,
        },
        // image: {
        //     type: String,
        //     required: true,
        // },
        image2: {
            type: String,
            required: true,
        },
        // image3: {
        //     type: String,
        //     required: true,
        // },
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        logo: {
            type: String,
            required: true,
        },
        link: {
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

const Ad = mongoose.model("Ad", adSchema);

export default Ad;