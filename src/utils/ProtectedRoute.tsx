import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../context/userContext";
const ProtectedRoute = () => {
  const { user } = useUserContext();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
