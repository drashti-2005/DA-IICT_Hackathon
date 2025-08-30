import User from '../models/user.model.js';
import Report from '../models/report.model.js';
import achievementSchema from '../utils/achievements.js';

// Helper function to calculate community impact score
const calculateCommunityImpactScore = async () => {
    const [totalReports, resolvedReports] = await Promise.all([
        Report.countDocuments(),
        Report.countDocuments({ status: 'resolved' })
    ]);

    if (totalReports === 0) return 0;
    return Math.round((resolvedReports / totalReports) * 100);
};

// Get community stats
export const getCommunityStats = async (req, res) => {
    try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const stats = {
            activeMembers: await User.countDocuments({ 'reports.0': { $exists: true } }),
            reportsThisMonth: await Report.countDocuments({ 
                createdAt: { $gte: firstDayOfMonth }
            }),
            areasProtected: await Report.distinct('location.address').length,
            impactScore: await calculateCommunityImpactScore()
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching community stats:', error);
        res.status(500).json({ message: 'Error fetching community statistics' });
    }
};

// Get global leaderboard
export const getGlobalLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.aggregate([
            {
                $lookup: {
                    from: 'reports',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'reports'
                }
            },
            {
                $project: {
                    fullname: 1,
                    level: 1,
                    points: 1,
                    reportsCount: { $size: '$reports' },
                    resolvedReports: {
                        $size: {
                            $filter: {
                                input: '$reports',
                                as: 'report',
                                cond: { $eq: ['$$report.status', 'resolved'] }
                            }
                        }
                    },
                    impactScore: {
                        $multiply: [
                            {
                                $cond: [
                                    { $eq: [{ $size: '$reports' }, 0] },
                                    0,
                                    {
                                        $multiply: [
                                            {
                                                $divide: [
                                                    {
                                                        $size: {
                                                            $filter: {
                                                                input: '$reports',
                                                                as: 'report',
                                                                cond: { $eq: ['$$report.status', 'resolved'] }
                                                            }
                                                        }
                                                    },
                                                    { $size: '$reports' }
                                                ]
                                            },
                                            100
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            },
            { $sort: { points: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            leaderboard,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Error fetching leaderboard data' });
    }
};

// Get leaderboard by region/location
export const getRegionalLeaderboard = async (req, res) => {
    try {
        const { region } = req.query;
        if (!region) {
            return res.status(400).json({ message: 'Region parameter is required' });
        }

        const leaderboard = await User.aggregate([
            {
                $lookup: {
                    from: 'reports',
                    localField: '_id',
                    foreignField: 'userId',
                    pipeline: [
                        {
                            $match: {
                                'location.address': { $regex: region, $options: 'i' }
                            }
                        }
                    ],
                    as: 'reports'
                }
            },
            {
                $match: {
                    'reports.0': { $exists: true } // Only include users who have reports in the region
                }
            },
            {
                $project: {
                    fullname: 1,
                    level: 1,
                    points: 1,
                    reportsCount: { $size: '$reports' },
                    resolvedReports: {
                        $size: {
                            $filter: {
                                input: '$reports',
                                as: 'report',
                                cond: { $eq: ['$$report.status', 'resolved'] }
                            }
                        }
                    },
                    impactScore: {
                        $multiply: [
                            {
                                $cond: [
                                    { $eq: [{ $size: '$reports' }, 0] },
                                    0,
                                    {
                                        $multiply: [
                                            {
                                                $divide: [
                                                    {
                                                        $size: {
                                                            $filter: {
                                                                input: '$reports',
                                                                as: 'report',
                                                                cond: { $eq: ['$$report.status', 'resolved'] }
                                                            }
                                                        }
                                                    },
                                                    { $size: '$reports' }
                                                ]
                                            },
                                            100
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            },
            { $sort: { points: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            region,
            leaderboard,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error fetching regional leaderboard:', error);
        res.status(500).json({ message: 'Error fetching regional leaderboard data' });
    }
};

// Get user's rank and stats
export const getUserProgress = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get user's global rank and stats
        const [allUsers, user] = await Promise.all([
            User.find().sort({ points: -1 }),
            User.findById(userId).populate('reports')
        ]);

        const userRank = allUsers.findIndex(u => u._id.equals(userId)) + 1;
        
        // Calculate next level threshold
        const levelThresholds = {
            Scout: 500,
            Guardian: 1000,
            Protector: 2000
        };

        const nextLevelThreshold = levelThresholds[user.level];
        const progress = nextLevelThreshold ? (user.points / nextLevelThreshold * 100) : 100;

        // Get achievements
        const unlockedAchievements = user.achievements || [];
        const allAchievements = Object.values(achievementSchema).map(achievement => ({
            ...achievement,
            unlocked: unlockedAchievements.some(ua => ua.id === achievement.id)
        }));

        const response = {
            user: {
                username: user.fullname,
                rank: userRank,
                points: user.points,
                level: user.level,
                reports: user.reports.length,
                verified: user.verified,
                progress,
                nextLevel: nextLevelThreshold ? {
                    name: Object.keys(levelThresholds).find(key => levelThresholds[key] === nextLevelThreshold),
                    pointsNeeded: nextLevelThreshold - user.points
                } : null
            },
            achievements: allAchievements,
            stats: user.stats
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching user progress:', error);
        res.status(500).json({ message: 'Error fetching user progress data' });
    }
};
