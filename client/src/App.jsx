import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExplorerProvider } from './context/ExplorerContext';
import { ThemeProvider } from './context/ThemeContext';
import CustomCursor from './components/CustomCursor';

import React, { Suspense } from 'react';
import GlobalLoader from './components/GlobalLoader';

// Lazy loaded Pages
const WelcomePage = React.lazy(() => import('./pages/WelcomePage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const PassportPage = React.lazy(() => import('./pages/PassportPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const MapPage = React.lazy(() => import('./pages/MapPage'));
const CountryPage = React.lazy(() => import('./pages/CountryPage'));
const ScrapbookPage = React.lazy(() => import('./pages/ScrapbookPage'));
const AchievementsPage = React.lazy(() => import('./pages/AchievementsPage'));
const WildlifePage = React.lazy(() => import('./pages/WildlifePage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-bgPrimary flex items-center justify-center">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4" />
        <p className="text-textSecondary">Loading your adventure...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

// Auth Route (redirect to dashboard if already logged in)
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" /> : children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
        <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Protected Routes */}
        <Route path="/passport" element={<ProtectedRoute><PassportPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><ExplorerProvider><DashboardPage /></ExplorerProvider></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><ExplorerProvider><MapPage /></ExplorerProvider></ProtectedRoute>} />
        <Route path="/country/:code" element={<ProtectedRoute><ExplorerProvider><CountryPage /></ExplorerProvider></ProtectedRoute>} />
        <Route path="/scrapbook" element={<ProtectedRoute><ScrapbookPage /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
        <Route path="/wildlife" element={<ProtectedRoute><WildlifePage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen bg-bgPrimary flex items-center justify-center">
            <div className="text-center">
              <p className="text-6xl mb-4">🧭</p>
              <h1 className="font-display text-3xl font-bold text-textPrimary mb-2">Lost in the wilderness!</h1>
              <p className="text-textSecondary mb-6">This page doesn't exist on any map.</p>
              <a href="/" className="btn-primary">Return Home</a>
            </div>
          </div>
        } />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(15, 15, 35, 0.9)',
                color: '#fff',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                fontFamily: 'Inter, sans-serif',
              },
            }}
          />
          <CustomCursor />
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
