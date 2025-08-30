import User from '../models/user.model.js';
import Report from '../models/report.model.js';

export const getHomeStats = async (req, res) => {
    try {
        const [
            totalReports,
            activeProtectors,
            uniqueAreas,
            resolvedReports,
            totalReportsCount
        ] = await Promise.all([
            Report.countDocuments(),
            User.countDocuments({ 'reports.0': { $exists: true } }),
            Report.distinct('location.address').then(areas => areas.length),
            Report.countDocuments({ status: 'resolved' }),
            Report.countDocuments()
        ]);

        // Calculate impact score
        const impactScore = totalReportsCount > 0 
            ? Math.round((resolvedReports / totalReportsCount) * 100) 
            : 0;

        // Get top testimonials (users with most contributions)
        const topContributors = await User.aggregate([
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
                    role: 1,
                    level: 1,
                    reportsCount: { $size: '$reports' },
                    impactScore: {
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
                }
            },
            { $sort: { reportsCount: -1 } },
            { $limit: 2 }
        ]);

        // Format testimonials
        const testimonials = topContributors.map(user => ({
            name: user.fullname,
            role: user.level,
            content: `Active contributor with ${user.reportsCount} reports and ${Math.round(user.impactScore)}% impact score.`,
            rating: 5,
            avatar: user.fullname.split(' ').map(n => n[0]).join('')
        }));

        // Get features statistics
        const features = [
            {
                icon: "Shield",
                title: "Secure & Reliable",
                description: `Protecting ${uniqueAreas} mangrove areas with verified reports`,
                color: "text-primary"
            },
            {
                icon: "AlertCircle",
                title: "Report Damage",
                description: `${totalReports} reports submitted by our community`,
                color: "text-coral"
            },
            {
                icon: "BarChart3",
                title: "Track Progress",
                description: `${impactScore}% resolution rate on reported issues`,
                color: "text-ocean-deep"
            },
            {
                icon: "Users",
                title: "Community Power",
                description: `${activeProtectors} active protectors and growing`,
                color: "text-mangrove"
            }
        ];

        const stats = [
            { label: "Reports Submitted", value: totalReports.toLocaleString(), icon: "MapPin" },
            { label: "Active Protectors", value: activeProtectors.toLocaleString(), icon: "Users" },
            { label: "Areas Protected", value: uniqueAreas.toLocaleString(), icon: "Shield" },
            { label: "Impact Score", value: `${impactScore}%`, icon: "Award" }
        ];

        res.json({
            stats,
            features,
            testimonials,
            impactScore
        });
    } catch (error) {
        console.error('Error fetching home stats:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
};
