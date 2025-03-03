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

// ✅ Middleware (Correct Order)
app.use(cookieParser()); // ✅ Parses cookies before JSON
app.use(express.json());

// ✅ CORS Configuration
const corsOptions = {
  origin: "https://todo-app-rho-murex-36.vercel.app", // Your frontend URL
  credentials: true, // ✅ Required for cookies
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS middleware
app.use(cors(corsOptions));

// ✅ Manually handle CORS preflight OPTIONS requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://todo-app-rho-murex-36.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // ✅ Important for preflight requests
  }
  next();
});

// ✅ Debug Cookies
app.get("/check-cookies", (req, res) => {
  console.log("Received Cookies:", req.cookies);
  res.json({ cookies: req.cookies });
});

// ✅ Set Test Cookie
app.get("/set-cookie", (req, res) => {
  res.cookie("testCookie", "HelloWorld", {
    httpOnly: true,
    secure: true, // Ensure HTTPS is used
    sameSite: "None", // For cross-site cookies
  });
  res.json({ message: "Test cookie set!" });
});

// ✅ Basic route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

// ✅ Database Connection
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

// ✅ Routes
app.use("/todo", todoRoute);
app.use("/user", userRoute);

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
