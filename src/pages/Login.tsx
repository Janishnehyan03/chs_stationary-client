import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Shield, ShieldCheck, GraduationCap, Loader2 } from "lucide-react";
import Axios from "../Axios";
import { useUserContext } from "../context/userContext";

type UserRole = "student" | "teacher" | "admin" | "super-admin";

const roles: { id: UserRole; label: string; icon: React.ElementType }[] = [
  { id: "student", label: "Student", icon: GraduationCap },
  { id: "admin", label: "Admin", icon: Shield },
];

const Login: React.FC = () => {
  const { user, login } = useUserContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeRole, setActiveRole] = useState<UserRole>("admin");
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      if (user.role === "student" || user.role === "teacher") {
        navigate("/user", { replace: true });
      } else if (user.role === "admin" || user.role === "super-admin") {
        navigate("/", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

  if (user) {
    return null; // Return null instead of Navigate component to prevent flash while useEffect redirects
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole === "student") {
      toast.info(
        `${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} login is coming soon!`,
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
      return;
    }

    setIsLoading(true);
    setError("");

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
        navigate(activeRole === "admin" || activeRole === "super-admin" ? "/" : "/user");
      }, 1000);
    } catch (err: any) {
      console.error("Login failed:", err.response?.data);
      setError(err.response?.data?.message || "Login failed. Please try again.");
      toast.error("Login failed", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } finally {
      setIsLoading(false);
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
      title: "Student Portal",
      label: "Admission Number",
      placeholder: "Enter admission number",
      gradient: "from-blue-500 to-cyan-400",
      buttonColor: "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600",
      ringColor: "focus:ring-blue-500",
      textColor: "group-focus-within:text-blue-500",
    },
    teacher: {
      title: "Teacher Portal",
      label: "Phone Number",
      placeholder: "Enter phone number",
      gradient: "from-purple-500 to-pink-500",
      buttonColor: "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600",
      ringColor: "focus:ring-purple-500",
      textColor: "group-focus-within:text-purple-500",
    },
    admin: {
      title: "Admin Portal",
      label: "Username",
      placeholder: "Enter admin username",
      gradient: "from-emerald-500 to-teal-400",
      buttonColor: "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600",
      ringColor: "focus:ring-emerald-500",
      textColor: "group-focus-within:text-emerald-500",
    },
    "super-admin": {
      title: "Super Admin",
      label: "Username",
      placeholder: "Enter super admin username",
      gradient: "from-rose-500 to-red-500",
      buttonColor: "bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600",
      ringColor: "focus:ring-rose-500",
      textColor: "group-focus-within:text-rose-500",
    },
  };

  const currentConfig = roleConfig[activeRole];
  const isComingSoon = activeRole === "student";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-b from-transparent to-blue-500/10 dark:to-blue-500/5 blur-3xl transform rotate-12" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-t from-transparent to-purple-500/10 dark:to-purple-500/5 blur-3xl transform -rotate-12" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className={`absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br ${currentConfig.gradient} rounded-full blur-3xl opacity-20`}
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className={`absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-tr ${currentConfig.gradient} rounded-full blur-3xl opacity-20`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Area */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${currentConfig.gradient} shadow-lg mb-4`}
          >
            <ShieldCheck className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h2
            key={currentConfig.title}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight"
          >
            {currentConfig.title}
          </motion.h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign in to access your account dashboard
          </p>
        </div>

        {/* Floating Glass Card */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-800/50 shadow-2xl rounded-3xl p-6 sm:p-8">
          {/* Role Selector Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-2xl backdrop-blur-sm shadow-inner w-full flex-wrap sm:flex-nowrap">
              {roles.map((role) => {
                const isActive = activeRole === role.id;
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setActiveRole(role.id)}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium rounded-xl transition-all duration-300 ${isActive
                      ? "text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeRole"
                        className={`absolute inset-0 bg-gradient-to-r ${currentConfig.gradient} rounded-xl`}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className="relative z-10 hidden sm:inline-block"><Icon className="w-4 h-4" /></span>
                    <span className="relative z-10">{role.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isComingSoon ? (
              <motion.div
                key="coming-soon"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6 py-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 mb-2">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Access Coming Soon!
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-[280px] mx-auto">
                    We're building a seamless experience for {activeRole}s. Check back later for updates.
                  </p>
                </div>
                <div className="pt-4 flex justify-center">
                  <button
                    onClick={() => handleNavigation("/student")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium"
                  >
                    <GraduationCap className="w-4 h-4" /> Student
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3"
                  >
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-1.5 group">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {currentConfig.label}
                    </label>
                    <div className="relative">
                      <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 transition-colors ${currentConfig.textColor}`}>
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={username}
                        placeholder={currentConfig.placeholder}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`block w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all shadow-sm ${currentConfig.ringColor}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 group">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Password
                      </label>
                      <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 transition-colors ${currentConfig.textColor}`}>
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`block w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all shadow-sm ${currentConfig.ringColor}`}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md mt-8 text-sm font-bold text-white transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-opacity-50 ${currentConfig.buttonColor} ${currentConfig.ringColor}`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      `Sign in to ${activeRole.charAt(0).toUpperCase() + activeRole.slice(1).replace('-', ' ')}`
                    )}
                  </button>
                </form>

                {activeRole === "admin" && (
                  <div className="mt-8 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      Authorized personnel only. Secure connection.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer/Links */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Help Center</a>
          <span>&middot;</span>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
          <span>&middot;</span>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
