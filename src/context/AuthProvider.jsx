import { AuthContext } from "./Context";
import { useState, useEffect } from "react";
import { userApi } from "../api";
import axios from "axios";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false); 
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async ({ email, password }) => {
    try {
      const { data } = await axios.get(
        `${userApi}?email=${email}&password=${password}`
      );
      if (data.length > 0) {
        setUser(data[0]);
        return {
          success: true,
          user: data[0],
        };
      } else {
        return {
          success: false,
          message: "invalid email or password",
        };
      }
    } catch (err) {
      console.error("Login error:", err);
      return {
        success: false,
        message: "invalid email or password",
      };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const openAccount = () => setIsAccountOpen(true);
  const closeAccount = () => setIsAccountOpen(false);

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      login, 
      isAccountOpen, 
      openAccount, 
      closeAccount, 
      logout,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}