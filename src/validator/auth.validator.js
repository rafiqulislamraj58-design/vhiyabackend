
import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Invalid request data",
      errors: errors.array()
    });
  }

  next();
}

export const registerValidator = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters"),

  body("email")
    .isEmail()
    .withMessage("Enter a valid email address")
    .bail()
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be between 8 and 100 characters"),

  validateRequest
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Enter a valid email address")
    .bail()
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .isLength({ min: 8, max: 100 })
    .withMessage("Invalid email or password"),

  validateRequest
];