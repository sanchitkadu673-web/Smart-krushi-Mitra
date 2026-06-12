import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AddCrop } from './pages/AddCrop';
import { CropDetails } from './pages/CropDetails';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { ShopDashboard } from './pages/shop-owner/ShopDashboard';
import { ManageProducts } from './pages/shop-owner/ManageProducts';
import './i18n/config'; // Init i18n
import './index.css';

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean; allowedRole?: string }> = ({ children, adminOnly = false, allowedRole }) => {
  const { token, profile } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (allowedRole && profile?.role !== allowedRole) {
    // Redirect to their respective dashboards instead of generic /dashboard
    if (profile?.role === 'shop_owner') return <Navigate to="/shop" replace />;
    if (profile?.role === 'expert') return <Navigate to="/expert" replace />;
    if (profile?.role === 'admin' || profile?.role === 'super_admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected farmer routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRole="farmer">
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/crops/add" 
              element={
                <ProtectedRoute>
                  <AddCrop />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/crops/:id" 
              element={
                <ProtectedRoute>
                  <CropDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* Shop Owner Routes */}
            <Route 
              path="/shop" 
              element={
                <ProtectedRoute allowedRole="shop_owner">
                  <ShopDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/shop/products" 
              element={
                <ProtectedRoute allowedRole="shop_owner">
                  <ManageProducts />
                </ProtectedRoute>
              } 
            />

            {/* Admin-only routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="bottom-right" />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};
export default App;
