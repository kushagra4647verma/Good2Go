import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const key = process.env.JWT_SECRET;

export function auth(req, res, next) {
  const token = req.headers.token;
  try {
    const user = jwt.verify(token, key);
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token!" });
  }
}

export default auth;
