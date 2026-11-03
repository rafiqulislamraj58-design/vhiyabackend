import GalleryModel from "../models/gallery.model.js";
import { uploadToImageKit } from "../utils/upload.js"; 


export async function uploadGalleryImage(req, res) {
  try {
    const { caption, category } = req.body;
    const file = req.file; 

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "দয়া করে একটি ছবি আপলোড করুন।",
      });
    }

    const uploadResult = await uploadToImageKit(file.buffer, file.originalname);

    const newGalleryItem = await GalleryModel.create({
      imageUrl: uploadResult.url,
      caption: caption ? caption.trim() : "",
      category: category || "others",
    });

    return res.status(201).json({
     
      success: true,
      message: "ছবি সফলভাবে গ্যালারিতে যুক্ত করা হয়েছে।",
      data: newGalleryItem,
    });
  } catch (error) {
    console.error("Gallery upload error:", error);
    return res.status(500).json({
      success: false,
      message: "ছবি আপলোড করতে সমস্যা হয়েছে।",
    });
  }
}


export async function getAllGalleryImages(req, res) {
  try {
    const images = await GalleryModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    console.error("Get gallery error:", error);
    return res.status(500).json({
      success: false,
      message: "গ্যালারির ছবিগুলো লোড করা যায়নি।",
    });
  }
}

export async function deleteGalleryImage(req, res) {
  try {
    const { id } = req.params;

    const deletedImage = await GalleryModel.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        message: "ছবিটি খুঁজে পাওয়া যায়নি।",
      });
    }

    return res.status(200).json({
      success: true,
      message: "গ্যালারি থেকে ছবি সফলভাবে মুছে ফেলা হয়েছে।",
    });
  } catch (error) {
    console.error("Delete gallery image error:", error);
    return res.status(500).json({
      success: false,
      message: "ছবি ডিলিট করা সম্ভব হয়নি।",
    });
  }
}