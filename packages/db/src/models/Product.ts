import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        gallery: {
            type: [String],
            required: true,
        },
        // price: {
        //     type: Number,
        //     required: true,
        // },
        options: {
            type: Object,
            required: true,
        },
        volumes: {
            type: [Object],
            // required: true,
            default: [
                {
                    price: 0,
                    volume: "",
                    out_of_stock: false,
                }
            ]
        },
        // strength: {
        //     type: String,
        //     // required: true,
        // },
        // power: {
        //     type: String,
        //     // required: true,
        // },
        // intelligence: {
        //     type: String,
        //     // required: true,
        // },
        // hunger: {
        //     type: String,
        //     // required: true,
        // },
        heading1: {
            type: String,
            required: true,
        },
        text1: {
            type: String,
            required: true,
        },
        heading2: {
            type: String,
            required: true,
        },
        text2: {
            type: String,
            required: true,
        },
        heading3: {
            type: String,
            required: true,
        },
        text3: {
            type: String,
            required: true,
        },
        heading4: {
            type: String,
            required: true,
        },
        text4: {
            type: String,
            required: true,
        },
        display_order: {
            type: Number,
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

const Product = mongoose.model("Product", productSchema);

export default Product;
