# Modern React Frontend Application

A beautiful, modern frontend application built with React, Tailwind CSS, and connected to a Node.js/Express backend.

## ✨ Features

- **Modern UI Design**: Beautiful, responsive interface using Tailwind CSS v4.1.12
- **Authentication System**: Complete login/registration with JWT tokens
- **Protected Routes**: Secure dashboard and user areas
- **Responsive Design**: Mobile-first design that works on all devices
- **Form Validation**: Robust client-side validation using React Hook Form
- **State Management**: Context API for global state management
- **API Integration**: Seamless backend integration with Axios
- **Clean Architecture**: Modular, maintainable code structure

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation component
│   └── ProtectedRoute.jsx # Route protection
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   └── Dashboard.jsx   # Dashboard page
├── context/            # React Context providers
│   └── AuthContext.jsx # Authentication context
├── services/           # API services
│   ├── api.js          # Axios configuration
│   └── authService.js  # Authentication API calls
├── utils/              # Utility functions
│   └── helpers.js      # Common helper functions
├── App.jsx             # Main App component
└── main.jsx           # Entry point
```

## 🛠️ Required Dependencies

Install these additional dependencies to your existing `package.json`:

```bash
npm install react-router-dom@^7.3.1 axios@^1.7.2 react-hook-form@^7.52.0 lucide-react@^0.456.0
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 🎨 Pages Overview

### 🏠 Home Page
- **Hero Section**: Compelling call-to-action with gradient backgrounds
- **Features Section**: Highlight key platform benefits
- **Testimonials**: Social proof from satisfied users
- **Pricing Plans**: Clear pricing tiers with feature comparison
- **Responsive Design**: Optimized for all screen sizes

### 🔐 Login Page
- **Clean Form Design**: User-friendly login interface
- **Form Validation**: Real-time email and password validation
- **Error Handling**: Clear error messages for failed attempts
- **Social Login Options**: Google and GitHub integration placeholders
- **Remember Me**: Option to persist login sessions

### 📝 Registration Page
- **Multi-field Form**: Name, email, mobile, password, and role
- **Password Confirmation**: Ensure passwords match
- **Role Selection**: User or Admin role options
- **Terms & Conditions**: Legal compliance checkbox
- **Comprehensive Validation**: All fields validated client-side

### 📊 Dashboard Page
- **Statistics Cards**: Key metrics with trend indicators
- **Project Management**: Recent projects with progress tracking
- **Activity Feed**: Real-time user activity updates
- **Quick Actions**: Fast access to common tasks
- **Data Visualization**: Charts and progress indicators

## 🔧 Configuration

### Backend Integration

The frontend is configured to connect to your backend API at `http://localhost:5000/api`. 

**Backend Endpoints Used:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication

**Authentication Flow:**
1. User submits login/registration form
2. API call made to backend
3. JWT token received and stored in localStorage
4. User redirected to dashboard
5. Token included in subsequent API requests

### Environment Variables

Create a `.env` file in the client directory for environment-specific configurations:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=HackApp
```

## 🎨 Styling with Tailwind CSS

This project uses Tailwind CSS v4.1.12 with utility classes directly in components. No configuration files needed.

**Key Features:**
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: Easy to implement dark mode
- **Custom Animations**: Fade-ins, loading spinners
- **Consistent Spacing**: Using Tailwind's spacing scale
- **Color Palette**: Professional blue/purple gradient theme

## 🔒 Security Features

- **JWT Token Management**: Secure token storage and refresh
- **Protected Routes**: Dashboard accessible only when authenticated
- **Input Validation**: Client-side validation for all forms
- **XSS Protection**: Proper input sanitization
- **API Interceptors**: Automatic token injection and error handling

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Clean interface on tablet screens
- **Desktop**: Full-featured desktop experience
- **Navigation**: Responsive navbar with mobile menu

## 🚀 Production Ready

- **Code Splitting**: Optimized bundle sizes
- **Error Boundaries**: Graceful error handling
- **Loading States**: User feedback during API calls
- **SEO Optimized**: Proper meta tags and structure
- **Performance**: Optimized images and lazy loading

## 🤝 Integration with Backend

Your backend server structure:
```
server/
├── controller/
│   └── auth.controller.js    # Handles registration/login
├── models/
│   └── user.model.js         # User data model
├── routes/
│   └── auth.routes.js        # Authentication routes
└── index.js                  # Server entry point
```

**User Model Fields:**
- `fullname`: User's full name
- `email`: Email address (unique)
- `mobile`: Mobile number
- `password`: Hashed password
- `role`: 'admin' or 'user'

## 🔄 State Management

Using React Context API for:
- **Authentication State**: User login status and data
- **Global UI State**: Loading states, notifications
- **User Preferences**: Theme, language settings

## 📋 Form Handling

Using React Hook Form for:
- **Performance**: Minimal re-renders
- **Validation**: Built-in and custom validation rules
- **Error Handling**: Field-level error messages
- **User Experience**: Real-time feedback

## 🎯 Next Steps

1. **Install Dependencies**: Add the required npm packages
2. **Configure Backend**: Ensure your backend server is running on port 5000
3. **Test Authentication**: Try registration and login flows
4. **Customize Styling**: Modify colors and branding as needed
5. **Add Features**: Extend dashboard with your specific functionality

## 📞 Support

The frontend is designed to work seamlessly with your existing backend. All API endpoints match your current authentication controller structure.

For any issues or questions, check:
1. Backend server is running on port 5000
2. All required dependencies are installed
3. API endpoints match the frontend service calls
4. CORS is properly configured on the backend

Enjoy your modern, beautiful frontend application! 🎉+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
