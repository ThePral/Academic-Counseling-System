// src/admin/auth/ProtectedAdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const getRoleFromToken = (t) => {
  try { return JSON.parse(atob(t.split(".")[1]))?.role || null; } catch { return null; }
};

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("access_token");
  const role = token ? getRoleFromToken(token) : null;

  if (!token || role !== "admin") return <Navigate to="/admin/login" replace />;
  return children;
}
