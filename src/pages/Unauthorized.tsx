import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); // Adjust the path to your login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-700 mb-6">
        You are not authorized to access this page. Please log in to continue.
      </p>
      <button
        onClick={handleLogin}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Go to Login
      </button>
    </div>
  );
};

export default Unauthorized;
