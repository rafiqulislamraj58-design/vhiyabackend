
import config from "../config/config.js";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

const JWT_ALGORITHM = "HS256";


export function createAccessToken({ userId, role }) {
  return jwt.sign(
    {
      userId,
      role,
      tokenType: "access",
    },
    config.ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      algorithm: JWT_ALGORITHM,
    }
  );
}



export function createRefreshToken({ userId, role, jti }) {
  return jwt.sign(
    {
      userId,
      role,
      jti,
      tokenType: "refresh",
    },
    config.REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      algorithm: JWT_ALGORITHM,
    }
  );
}



export function readAccessToken(token) {
  const decoded = jwt.verify(
    token,
    config.ACCESS_TOKEN_SECRET,
    {
      algorithms: [JWT_ALGORITHM],
    }
  );

  if (decoded.tokenType !== "access") {
    throw new jwt.JsonWebTokenError("Invalid access token type");
  }

  return decoded;
}


export function readRefreshToken(token) {
  const decoded = jwt.verify(
    token,
    config.REFRESH_TOKEN_SECRET,
    {
      algorithms: [JWT_ALGORITHM],
    }
  );

  if (decoded.tokenType !== "refresh" || !decoded.jti) {
    throw new jwt.JsonWebTokenError("Invalid refresh token type");
  }

  return decoded;
}
