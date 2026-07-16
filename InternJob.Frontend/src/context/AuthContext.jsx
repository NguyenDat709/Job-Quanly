import { createContext, useContext, useEffect, useState } from "react";
import api from "../mockapi/api";
import axios from "axios";
const AuthContext = createContext(null);
const SESSION_KEY = "jobportal_session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) setUser(JSON.parse(raw));
    setLoading(false);
  }, []);
 function persist(u) {
    setUser(u);
    if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    else localStorage.removeItem(SESSION_KEY);
  }
  async function login(email, password) {
    const response = await api.post("/Auth/login", { email, password });
    const u = response.data;
    persist(u); 
    return u;
  }
  async function register(payload) {
    const response = await api.post("/Auth/register", payload);
    const u = response.data;
    persist(u);
    return u;
  }
  function logout() {
    persist(null);
  }

  function refreshUser(patch) {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
