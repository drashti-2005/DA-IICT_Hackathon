import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API functions
export const dashboardAPI = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Get user reports
  getUserReports: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    damageType?: string;
  }) => {
    const response = await api.get('/dashboard/reports', { params });
    return response.data;
  },

  // Update report status
  updateReportStatus: async (reportId: string, status: string) => {
    const response = await api.patch(`/dashboard/reports/${reportId}/status`, { status });
    return response.data;
  },

  // Get leaderboard data
  getLeaderboard: async () => {
    const response = await api.get('/dashboard/leaderboard');
    return response.data;
  }
};

// Report API functions
export const reportAPI = {
  // Create a new report
  createReport: async (reportData: {
    location: {
      type: string;
      coordinates: [number, number];
      address: string;
    };
    damageType: string;
    description: string;
    severity: string;
    images: string[];
  }) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  // Get all reports
  getReports: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    damageType?: string;
    severity?: string;
  }) => {
    const response = await api.get('/reports', { params });
    return response.data;
  },

  // Get report by ID
  getReportById: async (id: string) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  // Get nearby reports
  getNearbyReports: async (longitude: number, latitude: number, maxDistance?: number) => {
    const params: any = { longitude, latitude };
    if (maxDistance) params.maxDistance = maxDistance;
    const response = await api.get('/reports/nearby', { params });
    return response.data;
  },

  // Test create report (for debugging)
  testCreateReport: async () => {
    const response = await api.post('/reports/test');
    return response.data;
  }
};

// Leaderboard API functions
export const leaderboardAPI = {
  // Get global leaderboard
  getGlobalLeaderboard: async () => {
    const response = await api.get('/leaderboard/global');
    return response.data;
  },

  // Get regional leaderboard
  getRegionalLeaderboard: async (region: string) => {
    const response = await api.get('/leaderboard/regional', { params: { region } });
    return response.data;
  },

  // Get community stats
  getCommunityStats: async () => {
    const response = await api.get('/leaderboard/community-stats');
    return response.data;
  },

  // Get user's progress and achievements
  getUserProgress: async () => {
    const response = await api.get('/leaderboard/progress');
    return response.data;
  }
};

export default api;
