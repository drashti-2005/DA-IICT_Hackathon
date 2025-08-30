import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/hackathon_app",
      {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      }
    );
    console.log(
      `✅ MongoDB connected! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("💡 Make sure MongoDB is running or update MONGODB_URI in .env file");
    console.log("📝 For development, you can:");
    console.log("   1. Install MongoDB locally");
    console.log("   2. Use MongoDB Atlas (cloud)");
    console.log("   3. Use Docker: docker run -d -p 27017:27017 mongo");
    
    // Don't exit the process in development
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log("🚀 Server will continue without database connection for development");
    }
  }
};
