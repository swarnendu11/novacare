import React from "react";
import { useAuth } from "../../context/AuthContext";

/**
 * PermissionGate - Granular UI control based on user roles and permissions.
 * Useful for hiding buttons/actions even if the user is on the right route.
 */
export const PermissionGate = ({
  children,
  allowedRoles = [],
  permissions = [],
  fallback = null,
}) => {
  const { user } = useAuth();

  if (!user) return fallback;

  const hasRole = allowedRoles.length === 0 || allowedRoles.includes(user.role);

  // Example for permission-based checks (if your user object has a permissions array)
  const hasPermission =
    permissions.length === 0 ||
    permissions.every((p) => user.permissions?.includes(p));

  if (!hasRole || !hasPermission) {
    return fallback;
  }

  return <>{children}</>;
};
