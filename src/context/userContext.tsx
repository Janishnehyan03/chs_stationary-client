import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Axios from "../Axios";
import { User } from "../utils/types/types";

interface UserContextProps {
  user: User | null;
  login: (accessToken: string) => Promise<void>;
  logout: () => void;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Function to fetch user profile from /auth/profile
  const fetchUser = async (token: string) => {
    try {
      const response = await Axios.get<User>("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error: any) {
      console.error(
        "Failed to fetch user profile:",
        error?.response?.data || error.message
      );
      logout();
    }
  };

  // Fetch user on initial render if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      fetchUser(token);
    } else if (token && user) {
      fetchUser(token);
    } else {
      logout();
    }
  }, []);

  // Login function - store token & fetch user
  const login = async (accessToken: string) => {
    localStorage.setItem("token", accessToken);
    await fetchUser(accessToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
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
