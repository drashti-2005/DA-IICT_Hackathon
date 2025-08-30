// Points calculation utility
export const calculatePoints = (report) => {
    let points = 0;
    
    // Base points for submitting a report
    points += 10;

    // Points based on severity
    switch (report.severity) {
        case 'high':
            points += 15;
            break;
        case 'medium':
            points += 10;
            break;
        case 'low':
            points += 5;
            break;
    }

    // Bonus points for providing images
    if (report.images && report.images.length > 0) {
        points += 5;
    }

    // Bonus points for detailed description
    if (report.description && report.description.length > 100) {
        points += 5;
    }

    return points;
};

// Level calculation
export const calculateLevel = (totalPoints) => {
    if (totalPoints >= 2000) return "Guardian";
    if (totalPoints >= 1000) return "Protector";
    if (totalPoints >= 500) return "Defender";
    return "Scout";
};
