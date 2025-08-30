import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["admin", "user"], 
      default: "user" 
    },
    points: {
      type: Number,
      default: 0
    },
    level: {
      type: String,
      enum: ["Scout", "Guardian", "Protector", "Champion"],
      default: "Scout"
    },
    reports: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report'
    }],
    achievements: [{
      id: String,
      title: String,
      description: String,
      icon: String,
      unlockedAt: Date
    }],
    verified: {
      type: Boolean,
      default: false
    },
    stats: {
      totalReports: { type: Number, default: 0 },
      resolvedReports: { type: Number, default: 0 },
      photoReports: { type: Number, default: 0 },
      uniqueLocations: { type: Number, default: 0 },
      impactScore: { type: Number, default: 0 }
    },
    achievementProgress: {
      totalReports: { type: Number, default: 0 },
      reportsWithPhotos: { type: Number, default: 0 },
      uniqueLocations: [{ type: String }]
    },
    badge: {
      type: String,
      enum: ['🥇', '🥈', '🥉', '🌟', ''],
      default: ''
    },
    rank: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Method to add points and update level
userSchema.methods.addPoints = async function(points) {
  this.points += points;
  
  // Update level based on points
  if (this.points >= 1000) {
    this.level = "Champion";
  } else if (this.points >= 500) {
    this.level = "Protector";
  } else if (this.points >= 100) {
    this.level = "Guardian";
  }
  
  await this.save();
  return this.points;
};

export default mongoose.model("User", userSchema);
