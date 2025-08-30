import express from "express";
import reportController from "../controller/report.controller.js";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected routes (require authentication)
router.use(authMiddleware);

// Test endpoint to verify database
router.post("/test", reportController.testCreateReport);

// Create new report
router.post("/", reportController.createReport);

// Get all reports (with filtering and pagination)
router.get("/", reportController.getReports);

// Get nearby reports
router.get("/nearby", reportController.getNearbyReports);

// Get single report
router.get("/:id", reportController.getReportById);

// Update report status (admin only)
router.patch("/:id/status", isAdmin, reportController.updateReportStatus);

// Verify report (admin only)
router.patch("/:id/verify", isAdmin, reportController.verifyReport);

// Add comment to report
router.post("/:id/comments", reportController.addComment);

// Toggle upvote on report
router.post("/:id/upvote", reportController.toggleUpvote);

export default router;
