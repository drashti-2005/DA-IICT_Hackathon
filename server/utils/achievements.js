const achievementSchema = {
  FIRST_REPORT: {
    id: 'FIRST_REPORT',
    title: 'First Report',
    description: 'Submit your first damage report',
    icon: 'Star',
    points: 50
  },
  PHOTO_EVIDENCE: {
    id: 'PHOTO_EVIDENCE',
    title: 'Photo Evidence',
    description: 'Submit 10 reports with photo evidence',
    icon: 'Award',
    points: 100
  },
  LOCATION_SCOUT: {
    id: 'LOCATION_SCOUT',
    title: 'Location Scout',
    description: 'Report damage in 5 different locations',
    icon: 'TreePine',
    points: 150
  },
  COMMUNITY_HERO: {
    id: 'COMMUNITY_HERO',
    title: 'Community Hero',
    description: 'Reach 1000 protection points',
    icon: 'Shield',
    points: 200
  }
};

export default achievementSchema;
