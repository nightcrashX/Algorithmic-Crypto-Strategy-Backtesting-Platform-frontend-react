import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import Strategy from "../pages/Strategy";
import Market from "../pages/Market";
import Backtesting from "../pages/Backtesting";
import Settings from "../pages/Settings";

import DashboardLayout from "../layouts/dashboardLayout";
import AuthLayout from "../layouts/authLayout";

import ProtectedRoute from "../components/common/ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboard Layout */}
        <Route element={<ProtectedRoute>
                           <DashboardLayout />
                        </ProtectedRoute>}>

          <Route path="/markets" element={<Market />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/watchlist" element={<Market />} />
          <Route path="/indicators" element={<Strategy />} />

          <Route path="/strategy" element={<Strategy />} />

          <Route path="/Market" element={<Market />} />

          <Route path="/backtesting" element={<Backtesting />} />

          <Route path="/settings" element={<Settings />} />

        </Route>

        {/* 404 */}
        <Route path="*" element={<h1>404 Page Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
