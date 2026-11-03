import FuturePlanModel from "../models/futurePlan.model.js";

// 
export async function createFuturePlan(req, res) {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "পরিকল্পনার শিরোনাম এবং বিবরণ দেওয়া বাধ্যতামূলক।",
      });
    }

    const newPlan = await FuturePlanModel.create({
      title: title.trim(),
      description: description.trim(),
      priority: priority || "Medium",
    });

    return res.status(201).json({
      success: true,
      message: "ভবিষ্যৎ পরিকল্পনাটি সফলভাবে যুক্ত করা হয়েছে।",
      data: newPlan,
    });
  } catch (error) {
    console.error("Create future plan error:", error);
    return res.status(500).json({
      success: false,
      message: "পরিকল্পনা তৈরি করতে সমস্যা হয়েছে।",
    });
  }
}

// 
export async function getAllFuturePlans(req, res) {
  try {
    const plans = await FuturePlanModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    console.error("Get future plans error:", error);
    return res.status(500).json({
      success: false,
      message: "পরিকল্পনাগুলোর তালিকা লোড করা যায়নি।",
    });
  }
}

//
export async function deleteFuturePlan(req, res) {
  try {
    const { id } = req.params;

    const deletedPlan = await FuturePlanModel.findByIdAndDelete(id);

    if (!deletedPlan) {
      return res.status(404).json({
        success: false,
        message: "পরিকল্পনাটি খুঁজে পাওয়া যায়নি।",
      });
    }

    return res.status(200).json({
      success: true,
      message: "পরিকল্পনাটি সফলভাবে মুছে ফেলা হয়েছে।",
    });
  } catch (error) {
    console.error("Delete future plan error:", error);
    return res.status(500).json({
      success: false,
      message: "পরিকল্পনা ডিলিট করা সম্ভব হয়নি।",
    });
  }
}