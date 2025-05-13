import mongoose, { Schema } from "mongoose";

const tabSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        textTitle1: {
            type: String,
            required: true,
        },
        textDescription1: {
            type: String,
            required: true,
        },
        textTitle2: {
            type: String,
            required: true,
        },
        textDescription2: {
            type: String,
            required: true,
        },
        textTitle3: {
            type: String,
            required: true,
        },
        textDescription3: {
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
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

mongoose.models = {};

const Tab = mongoose.model("Tab", tabSchema);

export default Tab;
