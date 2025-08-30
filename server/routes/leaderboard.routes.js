import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
    getGlobalLeaderboard,
    getRegionalLeaderboard,
    getUserProgress,
    getCommunityStats
} from '../controller/leaderboard.controller.js';

const router = express.Router();

// Protected routes - require authentication
router.use(authMiddleware);

// Get global leaderboard
router.get('/global', getGlobalLeaderboard);

// Get regional leaderboard
router.get('/regional', getRegionalLeaderboard);

// Get user's progress and achievements
router.get('/progress', getUserProgress);

// Get community stats
router.get('/community-stats', getCommunityStats);

export default router;
