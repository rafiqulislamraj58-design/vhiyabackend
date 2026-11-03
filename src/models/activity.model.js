import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["meeting", "social", "campaign", "speech", "others"], 
      default: "general",
    },
    images: {
      type: [String], 
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ActivityModel = mongoose.model("Activity", activitySchema);

export default ActivityModel;