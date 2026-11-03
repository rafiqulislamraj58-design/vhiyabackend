export function isAdmin(req, res, next) {
  try {
  
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}