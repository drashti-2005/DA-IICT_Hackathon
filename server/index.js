import express from "express";
import { dbConnect } from "./utils/db.utils.js";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import reportRoutes from "./routes/report.routes.js";
import { default as dashboardRoutes } from "./routes/dashboard.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import homeRoutes from "./routes/home.routes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin:'*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.static("public"));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan("dev"));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/home", homeRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// 404 handler for unmatched routes
app.use((req, res, next) => {
  // Only handle if no route was matched
  if (!res.headersSent) {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      availableRoutes: [
        "GET /api/health",
        "POST /api/auth/register",
        "POST /api/auth/login"
      ]
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

console.log("🚀 Server starting on port:", process.env.PORT || 5000);

// Start server and attempt database connection
const startServer = async () => {
  try {
    console.log("📡 Attempting to connect to MongoDB...");
    console.log("🔗 MongoDB URI:", process.env.MONGODB_URI ? "URI is set" : "URI is missing!");
    await dbConnect();
    console.log("✅ MongoDB connection successful!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Stack:", error.stack);
    console.log("⚠️  Check your MONGODB_URI in .env file");
  }

  // Start the server regardless of database connection
  app.listen(process.env.PORT || 5000, () => {
    console.log(`✅ Server running on http://localhost:${process.env.PORT || 5000}`);
    console.log("📋 Available endpoints:");
    console.log("   GET /api/health - Health check");
    console.log("   POST /api/auth/register - Register new user");
    console.log("   POST /api/auth/login - Login user");
    console.log("   POST /api/reports - Create report");
    console.log("   GET /api/reports - Get all reports");
  });
};

startServer();