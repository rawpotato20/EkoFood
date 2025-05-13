import mongoose, { model, Schema } from "mongoose";

const settingSchema = new Schema(
  {
    certificate: {
      type: String,
      required: true,
    },
    contact_email: {
      type: String,
      required: true,
    },
    contact_phone: {
      type: String,
      required: true,
    },
    about_eco_discount_text: {
      type: String,
      required: true,
    },
    about_page_content: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      default: "mod",
    },
    // discount: {
    //     type: Number,
    //     required: true,
    // },
    warning_text: {
      type: String,
      required: true,
    },
    shipping_bracket: {
      type: Number,
      required: true,
    },
    shipping_fees: {
      type: Object,
      required: true,
    },
    login_text: {
      type: String,
      required: true,
    },
    ads_title: {
      type: String,
      required: false
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

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;