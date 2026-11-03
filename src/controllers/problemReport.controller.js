import ProblemReportModel from "../models/problemReport.model.js";

export async function submitProblem(req, res) {
  try {
    const { name, phone, area, problemDetails } = req.body;

    if (!name || !phone || !area || !problemDetails) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newProblem = await ProblemReportModel.create({
      name: name.trim(),
      phone: phone.trim(),
      area: area.trim(),
      problemDetails: problemDetails.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Your problem has been submitted successfully. Thank you!",
      data: newProblem,
    });
  } catch (error) {
    console.error("Submit problem error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting your problem. Please try again.",
    });
  }
}

export async function getAllProblems(req, res) {
  try {
    const problems = await ProblemReportModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (error) {
    console.error("Get problems error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the problem reports.",
    });
  }
}

export async function updateProblemStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "In Progress", "Resolved"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid status (Pending, In Progress, Resolved).",
      });
    }

    const updatedProblem = await ProblemReportModel.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedProblem) {
      return res.status(404).json({
        success: false,
        message: "Problem report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem status updated successfully.",
      data: updatedProblem,
    });
  } catch (error) {
    console.error("Update problem status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update the problem status.",
    });
  }
}