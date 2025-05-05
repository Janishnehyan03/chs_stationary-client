import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Axios from "../Axios";
import { useUserContext } from "../context/userContext";

type UserRole = "student" | "teacher" | "admin" | "super-admin";

const Login: React.FC = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  if (user) {
    if (user.role === "student" || user.role === "teacher") {
      return <Navigate to="/user" replace />;
    } else if (user.role === "admin" || user.role === "super-admin") {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/" replace />;
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeRole, setActiveRole] = useState<UserRole>("student");

  const { login } = useUserContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole === "student" || activeRole === "teacher") {
      toast.info(
        `${
          activeRole.charAt(0).toUpperCase() + activeRole.slice(1)
        } login is coming soon!`,
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
      return;
    }

    try {
      const response = await Axios.post("/auth/login", {
        username,
        password,
        role: activeRole,
      });

      const accessToken = response.data.access_token;
      if (!accessToken) throw new Error("Access token missing");

      await login(accessToken);

      setUsername("");
      setPassword("");
      setError("");

      toast.success("Login successful", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
      });

      setTimeout(() => {
        navigate(
          activeRole === "admin" || activeRole === "super-admin" ? "/" : "/user"
        );
      }, 1000);
    } catch (err: any) {
      console.error("Login failed:", err.response?.data);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      toast.error("Login failed", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
      });
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    toast.info(`Navigating to ${path} - Coming soon!`, {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const roleConfig = {
    student: {
      title: "Student Login",
      label: "Admission Number",
      placeholder: "Enter your admission number",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-500",
      buttonColor: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    },
    teacher: {
      title: "Teacher Login",
      label: "Phone Number",
      placeholder: "Enter your phone number",
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
      borderColor: "border-purple-500",
      buttonColor: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
    },
    admin: {
      title: "Admin Login",
      label: "Username",
      placeholder: "Enter your username",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      borderColor: "border-green-500",
      buttonColor: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    },
    "super-admin": {
      title: "Super Admin Login",
      label: "Username",
      placeholder: "Enter your username",
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      borderColor: "border-red-500",
      buttonColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
  };

  const currentConfig = roleConfig[activeRole];

  const isComingSoon = activeRole === "student" || activeRole === "teacher";

  return (
    <div
      className={`min-h-screen ${currentConfig.bgColor} flex flex-col justify-center py-12 sm:px-6 lg:px-8`}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2
          className={`mt-6 text-center text-3xl font-extrabold ${currentConfig.textColor}`}
        >
          {currentConfig.title}
        </h2>
        <div className="flex justify-center mt-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {(["student", "teacher", "admin"] as UserRole[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setActiveRole(role)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeRole === role
                    ? `${roleConfig[role].buttonColor} text-white`
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } ${role === "student" ? "rounded-r-none" : ""} ${
                  role === "admin" ? "rounded-l-none" : ""
                } ${
                  role === "teacher" ? "border-l-0 border-r-0 rounded-none" : ""
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className={`bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border-t-4 ${currentConfig.borderColor}`}
        >
          {isComingSoon ? (
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}{" "}
                Access Coming Soon!
              </h3>
              <p className="text-sm text-gray-600">
                We're working hard to bring {activeRole} login functionality to
                you soon!
                {activeRole === "student"
                  ? " Student access will be available at /student."
                  : " Teacher access will be available at /teacher."}
              </p>
              <p className="text-sm text-gray-600">
                In the meantime, admin login is fully operational. Please
                contact your administrator for assistance.
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  onClick={() => handleNavigation("/student")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Go to /student
                </button>
                <button
                  onClick={() => handleNavigation("/teacher")}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Go to /teacher
                </button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {currentConfig.label}
                  </label>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      placeholder={currentConfig.placeholder}
                      onChange={(e) => setUsername(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentConfig.buttonColor}`}
                  >
                    Sign in as{" "}
                    {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}
                  </button>
                </div>
              </form>

              {activeRole === "admin" && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  <p className="text-xs text-gray-500">
                    Authorized personnel only. Unauthorized access prohibited.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Developed by{" "}
            <a
              href="https://digitiostack.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Digitio Stack
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
