import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";

interface RoleBasedRouteProps {
  allowedRoles: ("admin" | "user" | "super-admin")[];
  children: React.ReactNode;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { user } = useUserContext();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (
    user.role &&
    !allowedRoles.includes(user.role as "admin" | "user" | "super-admin")
  ) {
    // Redirect to unauthorized if role is not allowed
    return <Navigate to="/unauthorized" replace />;
  }
  return children as React.ReactElement;
};

export default RoleBasedRoute;
