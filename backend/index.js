import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import todoRoute from "./routes/todo.route.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);

const app = express();

const PORT = process.env.PORT || 3001;
const DB_URI = process.env.MONGODB_URI;

// Middleware (Correct Order)
app.use(cookieParser()); // ✅ Parses cookies before JSON
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://todo-app-rho-murex-36.vercel.app",
    credentials: true,  // ✅ Must be true
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Debug Cookies
app.get("/check-cookies", (req, res) => {
  console.log("Received Cookies:", req.cookies);
  res.json({ cookies: req.cookies });
});

// Set Test Cookie
app.get("/set-cookie", (req, res) => {
  res.cookie("testCookie", "HelloWorld", {
    httpOnly: true,
    secure: false, // Change to true if using HTTPS
    sameSite: "Lax", // Adjust as needed
  });
  res.json({ message: "Test cookie set!" });
});
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use("/todo", todoRoute);
app.use("/user", userRoute);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
