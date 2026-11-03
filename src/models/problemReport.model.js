import mongoose from "mongoose";

const problemReportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: String,
      required: true, 
      trim: true,
    },
    problemDetails: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProblemReportModel = mongoose.model("ProblemReport", problemReportSchema);

export default ProblemReportModel;