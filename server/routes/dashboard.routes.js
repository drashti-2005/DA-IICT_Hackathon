import express from 'express';
import { 
  getUserStats,
  getUserReports,
  getReportById,
  getNearbyReports,
  getAllReports,
  updateReportStatus,
  verifyReport,
  getLeaderboard,
  getUserProfile
} from '../controller/dashboard.controller.js';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes - require authentication
router.use(authMiddleware);

// User routes
router.get('/stats', getUserStats);
router.get('/reports', getUserReports);
router.get('/reports/nearby', getNearbyReports); // Note: Order matters! This needs to be before :reportId
router.get('/reports/:reportId', getReportById);

// Admin routes
router.get('/all-reports', isAdmin, getAllReports);
router.patch('/reports/:reportId/status', isAdmin, updateReportStatus);
router.patch('/reports/:reportId/verify', isAdmin, verifyReport);

// Leaderboard routes
router.get('/leaderboard', getLeaderboard);
router.get('/user/:userId/profile', getUserProfile);

export default router;
