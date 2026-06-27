/**
 * Role-Based Route - Requires specific role(s)
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

export default function RoleBasedRoute({ children, allowedRoles }) {
  return (
    <ProtectedRoute>
      <RoleCheck allowedRoles={allowedRoles}>{children}</RoleCheck>
    </ProtectedRoute>
  );
}

function RoleCheck({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}
