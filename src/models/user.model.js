
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic user information
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254
    },

    // Authentication provider
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      required: true
    },

    // Local password authentication
    PassHash: {
      type: String,
      select: false,
      required: function () {
        return this.provider === "local";
      }
    },

    // Google OAuth information
   googleId: {
  type: String,
  default: null
},
    // User authorization
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    // Refresh token security
    refreshTokenHash: {
      type: String,
      default: null,
      select: false
    },

    // Account status
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active"
    },

    // Email verification
    isEmailVerified: {
      type: Boolean,
      default: false
    },

    // Profile image
    avatar: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Google ID should be unique when provided
userSchema.index(
  { googleId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      googleId: { $type: "string" }
    }
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
