import User from '../models/user.model.js';
import achievementSchema from './achievements.js';

export const checkAndAwardAchievements = async (userId, report) => {
    const user = await User.findById(userId);
    const newAchievements = [];
    
    // Update achievement progress
    user.achievementProgress.totalReports++;
    if (report.images && report.images.length > 0) {
        user.achievementProgress.reportsWithPhotos++;
    }
    // Add location if it's not already in the array
    if (!user.achievementProgress.uniqueLocations.includes(report.location.address)) {
        user.achievementProgress.uniqueLocations.push(report.location.address);
    }

    // Check FIRST_REPORT achievement
    if (user.achievementProgress.totalReports === 1 && 
        !user.achievements.some(a => a.id === 'FIRST_REPORT')) {
        newAchievements.push({
            ...achievementSchema.FIRST_REPORT,
            unlockedAt: new Date()
        });
    }

    // Check PHOTO_EVIDENCE achievement
    if (user.achievementProgress.reportsWithPhotos >= 10 && 
        !user.achievements.some(a => a.id === 'PHOTO_EVIDENCE')) {
        newAchievements.push({
            ...achievementSchema.PHOTO_EVIDENCE,
            unlockedAt: new Date()
        });
    }

    // Check LOCATION_SCOUT achievement
    if (user.achievementProgress.uniqueLocations.length >= 5 && 
        !user.achievements.some(a => a.id === 'LOCATION_SCOUT')) {
        newAchievements.push({
            ...achievementSchema.LOCATION_SCOUT,
            unlockedAt: new Date()
        });
    }

    // Check COMMUNITY_HERO achievement
    if (user.points >= 1000 && 
        !user.achievements.some(a => a.id === 'COMMUNITY_HERO')) {
        newAchievements.push({
            ...achievementSchema.COMMUNITY_HERO,
            unlockedAt: new Date()
        });
    }

    // Add new achievements and points
    if (newAchievements.length > 0) {
        user.achievements.push(...newAchievements);
        const achievementPoints = newAchievements.reduce((total, ach) => total + ach.points, 0);
        await user.addPoints(achievementPoints);
    }

    await user.save();
    return newAchievements;
};

export const updateLeaderboardRanks = async () => {
    // Get all users sorted by points
    const users = await User.find().sort({ points: -1});

    // Update ranks and badges
    const updates = users.map((user, index) => {
        let badge = '';
        if (index === 0) badge = '🥇';
        else if (index === 1) badge = '🥈';
        else if (index === 2) badge = '🥉';
        else if (user.points >= 500) badge = '🌟';

        return User.findByIdAndUpdate(user._id, {
            rank: index + 1,
            badge: badge
        });
    });

    await Promise.all(updates);
};
