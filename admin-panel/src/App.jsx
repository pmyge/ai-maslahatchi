import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Topics from './pages/Topics';
import FAQs from './pages/FAQs';
import Users from './pages/Users';
import Messages from './pages/Messages';
import Login from './pages/Login';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/topics" element={
          <ProtectedRoute>
            <Topics />
          </ProtectedRoute>
        } />

        <Route path="/faqs" element={
          <ProtectedRoute>
            <FAQs />
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        } />

        <Route path="/messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
