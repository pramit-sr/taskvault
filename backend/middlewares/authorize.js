import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    console.log("Cookies Received:", req.cookies);

    const token = req.cookies?.jwt;
    if (!token) {
      console.log("❌ No token found");
      return res.status(401).json({ message: "Unauthorized: No token found" });
    }

    console.log("🔑 Received Token:", token);
    console.log("🔑 Using JWT Secret Key:", process.env.JWT_SECRET_KEY);

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("✅ Decoded Token:", decoded);

    // Fetch User from DB
    req.user = await User.findById(decoded.userId);
    if (!req.user) {
      console.log("❌ User not found in DB");
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    console.log("✅ User Authenticated:", req.user);
    next();
  } catch (error) {
    console.error("❌ JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: " + error.message });
  }
};
