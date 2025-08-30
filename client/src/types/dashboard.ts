export interface UserStats {
  totalReports: number;
  resolvedIssues: number;
  impactScore: number;
  points: number;
  level: string;
  joinDate: string;
  nextLevel?: {
    name: string;
    pointsNeeded: number;
  };
}

export interface Report {
  _id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'investigating' | 'resolved';
  location: {
    type: string;
    coordinates: [number, number];
    address: string;
  };
  userId: {
    _id: string;
    fullname: string;
    email: string;
  };
  createdAt: string;
  images: string[];
}

export interface DashboardResponse {
  user: {
    points: number;
    level: string;
    badges: string[];
  };
  stats: {
    totalReports: number;
    resolvedIssues: number;
    impactScore: number;
    joinDate: string;
  };
  nextLevel: {
    name: string;
    pointsNeeded: number;
  } | null;
}
