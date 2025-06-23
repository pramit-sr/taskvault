import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import todoRoute from "./routes/todo.route.js";
import userRoute from "./routes/user.route.js";

dotenv.config();

const app = express();

// Config
const PORT = process.env.PORT || 3001;
const DB_URI = process.env.MONGODB_URI;

// ✅ Allowed frontends (local + deployed)
const allowedOrigins = [
  "http://localhost:5173",
  "https://todo-app-rho-murex-36.vercel.app",
  "https://taskvault.guddusarkar-com.workers.dev",
  "https://taskvault.duckdns.org",  // ✅ add this line,
  "http://taskvlt.duckdns.org"
];


// ✅ CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Parse cookies & JSON
app.use(cookieParser());
app.use(express.json());

// ✅ Debug test routes
app.get("/check-cookies", (req, res) => {
  console.log("Received Cookies:", req.cookies);
  res.json({ cookies: req.cookies });
});

app.get("/set-cookie", (req, res) => {
  res.cookie("testCookie", "HelloWorld", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ✅ true if deployed
    sameSite: "Lax",
  });
  res.json({ message: "Test cookie set!" });
});

app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

// ✅ MongoDB connection
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

// ✅ API routes
app.use("/todo", todoRoute);
app.use("/user", userRoute);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
