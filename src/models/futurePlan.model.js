import mongoose from "mongoose";

const futurePlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const FuturePlanModel = mongoose.model("FuturePlan", futurePlanSchema);

export default FuturePlanModel;