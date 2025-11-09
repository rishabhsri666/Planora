import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Auth from './Auth';
import PlanGenerator from './PlanGen';
import Settings from './Settings';
import MySchedules from './MySchedules';
import ScheduleDetail from './ScheduleDetail';
import Dashboard from './Dashboard';
// import MyTask from './MyTask';

function App() {
  return (

      <Routes>
        {/* Public Routes - Accessible without login */}
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        {/* Protected Routes - Require authentication */}
        <Route
          path="/plan-generator"
          element={
            <ProtectedRoute>
              <PlanGenerator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-schedules"
          element={
            <ProtectedRoute>
              <MySchedules />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/my-task"
          element={
            <ProtectedRoute>
              <MyTask />
            </ProtectedRoute>
          }
        /> */}


        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/schedule/:id" 
          element={
            <ProtectedRoute>
              <ScheduleDetail />
            </ProtectedRoute>
          } 
        />

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

  );
}

export default App;