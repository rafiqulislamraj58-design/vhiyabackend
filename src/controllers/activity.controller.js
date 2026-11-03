import ActivityModel from "../models/activity.model.js";
import { uploadToImageKit } from "../utils/upload.js";


export async function createActivity(req, res) {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "শিরোনাম এবং বিবরণ দেওয়া বাধ্যতামূলক।",
      });
    }

    let imageUrls = [];


    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const uploadResult = await uploadToImageKit(file.buffer, file.originalname);
        imageUrls.push(uploadResult.url);
      }
    }

    const newActivity = await ActivityModel.create({
      title: title.trim(),
      description: description.trim(),
      category: category || "general",
      images: imageUrls,
    });

    return res.status(201).json({
      success: true,
      message: "কার্যক্রমটি সফলভাবে পোস্ট করা হয়েছে।",
      data: newActivity,
    });
  } catch (error) {
    console.error("Create activity error:", error);
    return res.status(500).json({
      success: false,
      message: "কার্যক্রম পোস্ট করতে সমস্যা হয়েছে।",
    });
  }
}

export async function getAllActivities(req, res) {
  try {
    const activities = await ActivityModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error("Get activities error:", error);
    return res.status(500).json({
      success: false,
      message: "কার্যক্রমের তালিকা লোড করা যায়নি।",
    });
  }
}

export async function deleteActivity(req, res) {
  try {
    const { id } = req.params;

    const deletedActivity = await ActivityModel.findByIdAndDelete(id);

    if (!deletedActivity) {
      return res.status(404).json({
        success: false,
        message: "পোস্টটি খুঁজে পাওয়া যায়নি।",
      });
    }

    return res.status(200).json({
      success: true,
      message: "কার্যক্রমের পোস্টটি সফলভাবে মুছে ফেলা হয়েছে।",
    });
  } catch (error) {
    console.error("Delete activity error:", error);
    return res.status(500).json({
      success: false,
      message: "পোস্ট ডিলিট করা সম্ভব হয়নি।",
    });
  }
}

export async function updateActivity(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

  
    const activity = await ActivityModel.findById(id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "পোস্টটি খুঁজে পাওয়া যায়নি।",
      });
    }

    if (title) activity.title = title.trim();
    if (description) activity.description = description.trim();
    if (category) activity.category = category;

   
    if (req.files && req.files.length > 0) {
      let newImageUrls = [];
      for (let file of req.files) {
        const uploadResult = await uploadToImageKit(file.buffer, file.originalname);
        newImageUrls.push(uploadResult.url);
      }
      
      activity.images = [...activity.images, ...newImageUrls]; 
    }

    await activity.save();

    return res.status(200).json({
      success: true,
      message: "কার্যক্রমের পোস্টটি সফলভাবে আপডেট করা হয়েছে।",
      data: activity,
    });
  } catch (error) {
    console.error("Update activity error:", error);
    return res.status(500).json({
      success: false,
      message: "পোস্ট আপডেট করতে সমস্যা হয়েছে।",
    });
  }
}