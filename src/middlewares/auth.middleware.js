
import { readAccessToken } from "../utils/auth.utils.js";

export function authenticate(req, res, next) {
  try {
    // 
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      });
    }

    // 
    const accessToken = authorization.slice(7).trim();

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing",
      });
    }

    // 
    const decoded = readAccessToken(accessToken);

    // 
    if (!decoded.userId || !decoded.role) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token payload",
      });
    }

    // 
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    //
    return next();

  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }

    console.error("Authentication middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
}
