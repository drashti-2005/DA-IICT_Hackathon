import express from 'express';
import { getHomeStats } from '../controller/home.controller.js';

const router = express.Router();

// Get home page statistics
router.get('/stats', getHomeStats);

export default router;
