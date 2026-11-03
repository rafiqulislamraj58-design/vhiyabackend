import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

import {
  createAccessToken,
  createRefreshToken,
  readRefreshToken,
} from "../utils/auth.utils.js";

const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const BCRYPT_SALT_ROUNDS = 12;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/auth",
  maxAge: REFRESH_TOKEN_MAX_AGE,
};

const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/auth",
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const hashRefreshToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, cookieOptions);
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", clearCookieOptions);
};

const publicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  provider: user.provider,
  isEmailVerified: user.isEmailVerified,
  avatar: user.avatar || null,
  status: user.status,
  createdAt: user.createdAt,
});

const issueTokens = async (user, res) => {
  const payload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const accessToken = createAccessToken(payload);

  const refreshToken = createRefreshToken({
    ...payload,
    jti: crypto.randomUUID(),
  });

  user.refreshTokenHash = hashRefreshToken(refreshToken);

  await user.save();

  setRefreshCookie(res, refreshToken);

  return {
    user: publicUser(user),
    accessToken,
  };
};

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await UserModel.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const PassHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const user = await UserModel.create({
      name: name.trim(),
      email: normalizedEmail,
      PassHash,
      provider: "local",
      isEmailVerified: false,
    });

    const data = await issueTokens(user, res);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to register user",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const normalizedEmail = normalizeEmail(email);

    const user = await UserModel.findOne({
      email: normalizedEmail,
    }).select("+PassHash");

    if (!user || !user.PassHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.provider !== "local") {
      return res.status(401).json({
        success: false,
        message: "Please login using your Google account",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is suspended",
      });
    }

    const validPassword = await bcrypt.compare(password, user.PassHash);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const data = await issueTokens(user, res);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login",
    });
  }
}

export async function refresh(req, res) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    clearRefreshCookie(res);

    return res.status(401).json({
      success: false,
      message: "Refresh token cookie is missing",
    });
  }

  try {
    const decoded = readRefreshToken(refreshToken);

    if (!decoded.userId || !decoded.jti) {
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const oldTokenHash = hashRefreshToken(refreshToken);

    const payload = {
      userId: decoded.userId,
      role: decoded.role,
    };

    const newRefreshToken = createRefreshToken({
      ...payload,
      jti: crypto.randomUUID(),
    });

    const newTokenHash = hashRefreshToken(newRefreshToken);
    const newAccessToken = createAccessToken(payload);

    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: decoded.userId,
        status: "active",
        refreshTokenHash: oldTokenHash,
      },
      {
        $set: {
          refreshTokenHash: newTokenHash,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedUser) {
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh token already used or revoked",
      });
    }

    setRefreshCookie(res, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        user: publicUser(updatedUser),
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    clearRefreshCookie(res);

    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    console.error("Refresh error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to refresh token",
    });
  }
}

export async function getMe(req, res) {
  try {
    const user = await UserModel.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is suspended",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {
        user: publicUser(user),
      },
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user",
    });
  }
}

export async function googleCallback(req, res) {
  try {
    const profile = req.user;

    if (!profile?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google profile",
      });
    }

    const googleId = profile.id;
    const googleEmail = profile.emails?.[0];

    const email = googleEmail?.value ? normalizeEmail(googleEmail.value) : null;
    const isVerified = googleEmail?.verified === true;

    if (!email || !isVerified) {
      return res.status(401).json({
        success: false,
        message: "Verified Google email is required",
      });
    }

    let user = await UserModel.findOne({ googleId });

    if (user) {
      if (user.email !== email) {
        return res.status(401).json({
          success: false,
          message: "Google account email does not match",
        });
      }
    } else {
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "An account already exists with this email. Please use your existing login method.",
        });
      }

      user = await UserModel.create({
        name: profile.displayName || "Google User",
        email,
        provider: "google",
        googleId,
        isEmailVerified: true,
        avatar: profile.photos?.[0]?.value || null,
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is suspended",
      });
    }

    const data = await issueTokens(user, res);
    // redirect
    const frontendURL = process.env.CLIENT_URL;

    if (!frontendURL) {
      return res.status(200).json({
        success: true,
        message: "Google login successful",
        data,
      });
    }

    return res.redirect(
      `${frontendURL}/auth-success?accessToken=${data.accessToken}`,
    );
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Account already exists",
      });
    }

    console.error("Google callback error:", error);

    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
}

export async function logout(req, res) {
  const refreshToken = req.cookies?.refreshToken;

  try {
    if (refreshToken) {
      const decoded = readRefreshToken(refreshToken);
      const tokenHash = hashRefreshToken(refreshToken);

      await UserModel.updateOne(
        {
          _id: decoded.userId,
          refreshTokenHash: tokenHash,
        },
        {
          $set: {
            refreshTokenHash: null,
          },
        },
      );
    }
  } catch (error) {
    if (
      error.name !== "TokenExpiredError" &&
      error.name !== "JsonWebTokenError" &&
      error.name !== "NotBeforeError"
    ) {
      console.error("Logout error:", error);
    }
  }

  clearRefreshCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}
