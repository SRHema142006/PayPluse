import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUser = async () => {
    try {
      const data = await api.getProfile();
      setUser(data);
    } catch (err) {
      // Fallback demo user
      setUser({
        id: 1,
        email: "demo@payplus.in",
        owner_name: "Rajesh Sharma",
        business: { business_name: "Sharma Engineering & Supplies", business_type: "Manufacturing & B2B Distribution" }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    setError("");
    try {
      const res = await api.login({ email, password });
      localStorage.setItem("payplus_auth_token", res.access_token);
      await loadUser();
      return true;
    } catch (err) {
      setError(err.message || "Invalid credentials");
      return false;
    }
  };

  const loginDemo = async () => {
    setError("");
    try {
      const res = await api.login({ email: "demo@payplus.in", password: "demo123" });
      localStorage.setItem("payplus_auth_token", res.access_token);
      await loadUser();
      return true;
    } catch (err) {
      // Fallback demo state
      setUser({
        id: 1,
        email: "demo@payplus.in",
        owner_name: "Rajesh Sharma",
        business: { business_name: "Sharma Engineering & Supplies" }
      });
      return true;
    }
  };

  const register = async (formData) => {
    setError("");
    try {
      const res = await api.register(formData);
      localStorage.setItem("payplus_auth_token", res.access_token);
      await loadUser();
      return true;
    } catch (err) {
      setError(err.message || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("payplus_auth_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, loginDemo, register, logout, reloadProfile: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
