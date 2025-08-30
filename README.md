# 🌿 EcoGuard - Environmental Protection Platform

## 🏆 Hackathon Project Overview

**EcoGuard** is a comprehensive environmental protection platform designed to engage communities in reporting and tracking environmental damage, with a special focus on **mangrove conservation** and ecosystem protection. Built for the DA-IICT Hackathon, this platform gamifies environmental activism through a reward-based system.

## 🎯 Problem Statement

Environmental damage often goes unreported due to lack of accessible reporting mechanisms and community engagement. Our solution bridges this gap by creating a user-friendly platform that:
- Enables easy reporting of environmental damage
- Gamifies conservation efforts through points and leaderboards
- Tracks community impact and progress
- Builds a network of environmental protectors

## ✨ Key Features

### 🔐 **Authentication System**
- User registration and secure login
- JWT-based authentication
- Protected routes and user sessions

### 📊 **Interactive Dashboard**
- Personal environmental impact statistics
- Points and level progression tracking
- Recent reports overview
- Achievement badges system

### 📝 **Environmental Damage Reporting**
- Location-based damage reporting with GPS coordinates
- Photo upload functionality
- Severity classification (Low, Medium, High)
- Damage type categorization
- Real-time status tracking (Pending → Investigating → Resolved)

### 🏅 **Gamification & Rewards**
- **Point System**: Earn points for each report and resolved issue
- **Level Progression**: Scout → Guardian → Protector
- **Leaderboard**: Community rankings based on contributions
- **Achievement Badges**: Unlock rewards for milestones
- **Impact Score**: Track environmental protection effectiveness

### 📈 **Community Features**
- Global and regional leaderboards
- Community impact statistics
- User verification system
- Social recognition through rankings

### 🌍 **Environmental Focus Areas**
- Mangrove ecosystem protection
- Wildlife habitat conservation
- Pollution monitoring
- Deforestation tracking
- Ocean and coastal protection

## 🛠️ Technology Stack

### **Frontend** 
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **Shadcn/UI** component library for consistent design
- **React Router** for navigation
- **Context API** for state management

### **Backend**
- **Node.js** with **Express.js** framework
- **ES6 Modules** for modern JavaScript
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

### **Development & Deployment**
- **Docker** for containerization
- **Single Dockerfile** for Render deployment
- **Git** version control
- **npm** package management

### **Key Dependencies**

#### Frontend:
```json
{
  "@radix-ui/react-*": "UI components",
  "react-hook-form": "Form management",
  "lucide-react": "Modern icons",
  "sonner": "Toast notifications",
  "recharts": "Data visualization"
}
```

#### Backend:
```json
{
  "express": "Web framework",
  "mongoose": "MongoDB ODM",
  "jsonwebtoken": "Authentication",
  "bcrypt": "Password hashing",
  "cors": "Cross-origin requests",
  "dotenv": "Environment variables"
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Docker (for containerized deployment)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/drashti-2005/DA-IICT_Hackathon.git
cd DA-IICT_Hackathon
```

2. **Set up Backend**
```bash
cd server
npm install
# Create .env file with your MongoDB URI and JWT secret
echo "MONGODB_URI=your_mongodb_connection_string" > .env
echo "JWT_SECRET=your_jwt_secret" >> .env
npm run dev
```

3. **Set up Frontend**
```bash
cd ../client
npm install
npm run dev
```

### Docker Deployment (Render)

**Build the application:**
```bash
docker build -t daiict-hackathon .
```

**Run the container:**
```bash
docker run -p 5000:5000 daiict-hackathon
```

The application will be available at `http://localhost:5000`

## 📱 Application Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── context/       # React Context providers
│   │   ├── services/      # API service functions
│   │   └── types/         # TypeScript type definitions
│   └── public/            # Static assets
│
├── server/                # Node.js backend
│   ├── controller/        # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication middleware
│   └── utils/            # Utility functions
│
└── Dockerfile           # Container configuration
```

## 🌟 Core Functionalities

### 1. **User Journey**
- Register/Login → Dashboard → Submit Reports → Earn Points → Climb Leaderboard

### 2. **Reporting Workflow**
- Location Detection → Damage Assessment → Photo Upload → Severity Rating → Submission

### 3. **Gamification System**
- Points for reports: 10-50 points based on severity
- Level progression: Automatic leveling based on points
- Achievements: Special badges for milestones
- Leaderboard: Weekly/monthly rankings

### 4. **Administrative Features**
- Report status management
- User verification system
- Community moderation tools

## 🎨 Design Philosophy

- **Nature-Inspired UI**: Green gradients and earth tones reflecting environmental themes
- **Mobile-First**: Responsive design for field reporting
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Optimized images and lazy loading
- **User Experience**: Intuitive workflows and clear feedback

## 🔒 Security Features

- JWT token authentication
- Password encryption with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS configuration for secure cross-origin requests

## 📊 Impact Metrics

- **Community Engagement**: User registration and active participation rates
- **Environmental Reports**: Number and severity of issues reported
- **Resolution Tracking**: Percentage of resolved environmental issues
- **Geographic Coverage**: Areas protected and monitored
- **User Retention**: Gamification effectiveness through continued participation

## 🌱 Future Enhancements

- **Mobile App**: Native iOS/Android applications
- **AI Integration**: Automatic damage assessment from photos
- **IoT Sensors**: Real-time environmental monitoring
- **Blockchain**: Transparent reward distribution
- **Social Features**: Team challenges and collaborative reporting
- **Government Integration**: Direct reporting to environmental agencies

## 👥 Team & Hackathon Context

This project was developed for the **DA-IICT Hackathon** as a solution to environmental protection and community engagement challenges. The platform demonstrates:

- **Technical Proficiency**: Full-stack development with modern technologies
- **Problem-Solving**: Addressing real-world environmental issues
- **Innovation**: Gamification approach to environmental activism
- **Scalability**: Designed for community growth and expansion
- **Social Impact**: Potential for meaningful environmental protection

## 🚀 Deployment

The application is containerized using Docker and optimized for deployment on **Render**:
- Single Dockerfile combining frontend and backend
- Environment variable configuration
- Production-ready build process
- CORS enabled for all origins
- Port 5000 exposure for web traffic

## 📞 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Reports
- `POST /api/reports` - Create new report
- `GET /api/reports` - Get user reports
- `PUT /api/reports/:id/status` - Update report status

### Dashboard
- `GET /api/dashboard/stats` - Get user statistics
- `GET /api/dashboard/reports` - Get dashboard reports

### Leaderboard
- `GET /api/leaderboard/global` - Global rankings
- `GET /api/leaderboard/stats` - Community statistics

---

**Built with 💚 for environmental protection and community engagement**

*Empowering communities to protect our planet, one report at a time.*
