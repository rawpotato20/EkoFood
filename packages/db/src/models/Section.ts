import mongoose, { Schema } from "mongoose";

const sectionSchema = new Schema(
    {
        heading: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        image: {
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
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

mongoose.models = {};

const Section = mongoose.model("Section", sectionSchema);

export default Section;