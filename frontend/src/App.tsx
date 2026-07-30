import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NavbarLayout from './layouts/NavbarLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Result from './pages/Result';
import Insights from './pages/Insights';
import Tracker from './pages/Tracker';
import DietPlanner from './pages/DietPlanner';
import Recipes from './pages/Recipes';
import FoodFinder from './pages/FoodFinder';
import Education from './pages/Education';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import StreakMilestoneModal from './components/StreakMilestoneModal';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <StreakMilestoneModal />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <NavbarLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard as default path */}
            <Route index element={<Dashboard />} />
            <Route path="assessment" element={<Assessment />} />
            <Route path="result/:id" element={<Result />} />
            <Route path="insights" element={<Insights />} />
            <Route path="tracker" element={<Tracker />} />
            <Route path="diet-plan" element={<DietPlanner />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="food-finder" element={<FoodFinder />} />
            <Route path="education" element={<Education />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
