import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: ["meeting", "public-gathering", "social-work", "others"],
      default: "others",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const GalleryModel = mongoose.model("Gallery", gallerySchema);

export default GalleryModel;