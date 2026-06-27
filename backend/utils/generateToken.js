import jwt from "jsonwebtoken";

export const generateAccessToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET || "novacare_super_secure_jwt_secret_2026", 
    { expiresIn: "30d" } // 30 days for developer convenience, production-ready
  );
};

export const generateRefreshToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_REFRESH_SECRET || "novacare_super_secure_jwt_refresh_secret_2026", 
    { expiresIn: "7d" }
  );
};

export default generateAccessToken;
