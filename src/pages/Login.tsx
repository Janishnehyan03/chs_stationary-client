import React, { useState } from "react";
import Axios from "../Axios";
import { toast } from "react-toastify";
import { useUserContext } from "../context/userContext";
import { Navigate, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { user } = useUserContext();
  if (user) {
    return <Navigate to="/" replace />;
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useUserContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/auth/login", { username, password });

      // Extract token from response
      const accessToken = response.data.access_token;
      if (!accessToken) throw new Error("Access token missing");

      // Call login function to store token and fetch user profile
      await login(accessToken);

      // Clear form fields and error
      setUsername("");
      setPassword("");
      setError("");

      // Show success message
      toast.success("Login successful", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
      });

      // Redirect to the dashboard or home page
      navigate("/");
    } catch (err: any) {
      console.error("Login failed:", err.response?.data);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      toast.error("Login failed");
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center ">
      <div className="grid gap-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4">
          <div className="border-[20px] border-transparent rounded-[20px]  bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
            <h1 className="pt-8 pb-6 font-bold  text-5xl text-center cursor-default">
              Log in
            </h1>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="mb-2  text-lg">
                  Username
                </label>
                <input
                  id="username"
                  className="border p-3  shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-2  text-lg">
                  Password
                </label>
                <input
                  id="password"
                  className="border p-3  placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                className="bg-gradient-to-r  from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                type="submit"
              >
                LOG IN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
