import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";

interface RoleBasedRouteProps {
  allowedRoles: ("admin" | "user" | "super-admin" | "student" | "teacher")[];
  children: React.ReactNode;
}

const validRoles = [
  "admin",
  "user",
  "super-admin",
  "student",
  "teacher",
] as const;

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { user, isLoading } = useUserContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-48"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("Redirecting to /login: No user found");
    return <Navigate to="/login" replace />;
  }

  if (!user.role || !validRoles.includes(user.role as typeof validRoles[number])) {
    console.log(`Redirecting to /login: Invalid or missing role ${user.role}`);
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role as typeof validRoles[number])) {
    console.log(`Redirecting to /unauthorized: Role ${user.role} not allowed`);
    return <Navigate to="/unauthorized" replace />;
  }

  return children as React.ReactElement;
};

export default RoleBasedRoute;
