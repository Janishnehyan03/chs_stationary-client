import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { AxiosError } from "axios";
import Axios from "../Axios";
import { User } from "../utils/types/types";

// Enhanced storage utility with type safety
const storage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  },
  setToken: (token: string): void => {
    try {
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error setting token in localStorage:", error);
    }
  },
  removeToken: (): void => {
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Error removing token from localStorage:", error);
    }
  },
};

interface UserContextProps {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (accessToken: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with true to handle initial load
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Validate token and check expiration if JWT
  const isValidToken = useCallback((token: string | null): boolean => {
    if (!token) return false;
    
    // If using JWT, you could add expiration check here
    // Example for JWT:
    // try {
    //   const decoded = jwtDecode(token);
    //   return decoded.exp > Date.now() / 1000;
    // } catch {
    //   return false;
    // }
    
    return true;
  }, []);

  // Fetch user profile from /auth/profile
  const fetchUser = useCallback(async (token: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await Axios.get<User>("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = response.data;
      
      // Validate user role
      const validRoles = ["admin", "user", "super-admin", "student", "teacher"];
      if (userData.role && !validRoles.includes(userData.role)) {
        throw new Error(`Invalid user role: ${userData.role}`);
      }

      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const errorMessage = error.response?.data?.message ||
                         error.message ||
                         "Failed to fetch user profile";
      setError(errorMessage);
      setIsAuthenticated(false);

      // Logout on specific errors
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    const token = storage.getToken();
    if (isValidToken(token)) {
      await fetchUser(token!);
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, [fetchUser, isValidToken]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Login function
  const login = async (accessToken: string) => {
    if (!isValidToken(accessToken)) {
      setError("Invalid token provided");
      setIsAuthenticated(false);
      return;
    }
    storage.setToken(accessToken);
    await fetchUser(accessToken);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setError(null);
    setIsAuthenticated(false);
    storage.removeToken();
  };

  // Refresh user profile
  const refreshUser = async () => {
    const token = storage.getToken();
    if (isValidToken(token)) {
      await fetchUser(token!);
    } else {
      setError("No valid token found");
      logout();
    }
  };

  return (
    <UserContext.Provider
      value={{ 
        user, 
        isLoading, 
        error, 
        isAuthenticated,
        login, 
        logout, 
        refreshUser 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};