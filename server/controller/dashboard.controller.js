import Report from '../models/report.model.js';
import User from '../models/user.model.js';
import { calculateLevel } from '../utils/points.utils.js';

// Get user's dashboard statistics
const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id; // Changed from req.user.id to req.user._id
        const user = await User.findById(userId);
        const reports = await Report.find({ userId: userId });

        // Get total reports count
        const totalReports = reports.length;
        
        // Get resolved issues count
        const resolvedIssues = reports.filter(report => report.status === 'resolved').length;

        // Calculate impact score
        const impactScore = Math.min(Math.round((resolvedIssues / totalReports) * 100) || 0, 100);

        // Calculate next level threshold
        const currentLevel = user.level;
        const nextLevelThreshold = 
            currentLevel === 'Scout' ? 100 :
            currentLevel === 'Guardian' ? 500 :
            currentLevel === 'Protector' ? 1000 : null;

        const levelProgress = nextLevelThreshold ? (user.points / nextLevelThreshold) * 100 : 100;

        // Get user join date
        const joinDate = user.createdAt;

        res.json({
            user: {
                points: user.points,
                level: user.level,
                badges: user.badges,
                levelProgress
            },
            stats: {
                totalReports,
                resolvedIssues,
                impactScore,
                joinDate
            },
            nextLevel: nextLevelThreshold ? {
                name: calculateLevel(nextLevelThreshold),
                pointsNeeded: nextLevelThreshold - user.points
            } : null
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user stats", error: error.message });
    }
};

// Get user's reports with pagination and filters
const getUserReports = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const damageType = req.query.damageType;
        
        const query = { userId };
        if (status) query.status = status;
        if (damageType) query.damageType = damageType;

        const reports = await Report.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('userId', 'fullname email level points');

        const total = await Report.countDocuments(query);

        res.json({
            reports,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                hasMore: page * limit < total
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user reports", error: error.message });
    }
};

// Get all reports (for admin/moderators)
const getAllReports = async (req, res) => {
    try {
        // Add pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Add filters
        const filter = {};
        if (req.query.severity) filter.severity = req.query.severity;
        if (req.query.status) filter.status = req.query.status;

        const reports = await Report.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('submittedBy', 'fullname email');

        const total = await Report.countDocuments(filter);

        res.json({
            reports,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching all reports", error: error.message });
    }
};

// Update report status
const updateReportStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'investigating', 'resolved'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const report = await Report.findById(reportId);
        
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        // Optional: Add permission check here
        // For example, only allow admins or the original reporter to update status

        report.status = status;
        await report.save();

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: "Error updating report status", error: error.message });
    }
};

// Get nearby reports
const getNearbyReports = async (req, res) => {
    try {
        const { longitude, latitude, maxDistance = 10000 } = req.query; // maxDistance in meters, default 10km

        if (!longitude || !latitude) {
            return res.status(400).json({ message: "Location coordinates are required" });
        }

        const reports = await Report.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        }).populate('userId', 'fullname');

        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: "Error fetching nearby reports", error: error.message });
    }
};

// Get a single report by ID
const getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.reportId)
            .populate('userId', 'fullname email level points');

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: "Error fetching report", error: error.message });
    }
};

// Verify a report
const verifyReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.reportId);
        
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        report.verificationStatus = "verified";
        await report.save();

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: "Error verifying report", error: error.message });
    }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({}, 'fullname points level reports')
            .sort({ points: -1 })
            .limit(10);

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leaderboard", error: error.message });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId, 'fullname email points level reports');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile", error: error.message });
    }
};

export {
    getUserStats,
    getUserReports,
    getReportById,
    getNearbyReports,
    getAllReports,
    updateReportStatus,
    verifyReport,
    getLeaderboard,
    getUserProfile
};
