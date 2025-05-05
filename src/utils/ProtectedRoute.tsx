import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useUserContext } from "../context/userContext";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useUserContext();

  if (isLoading) {
    return <LoadingSpinner />; // Show loading state while checking auth
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
