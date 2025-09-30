import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // ⏳ wait until auth is restored
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
