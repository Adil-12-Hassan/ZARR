import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../api/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "zarr_auth_user";

function loadInitialUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadInitialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // - Register ---
  const register = async ({ username, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.register({ username, email, password });
      setUser(data); // { token, user: { ... } }
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // - Login ----─
  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.login({ email, password });
      setUser(data);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // - Admin Login ---------------─
  const adminLogin = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.adminLogin({ email, password });
      setUser(data);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // - Logout ----
  const logout = () => {
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user, // { token, user: { _id, username, email, role, ... } }
        loading,
        error,
        login,
        adminLogin,
        register,
        logout,
        isAuthenticated: Boolean(user),
        isAdmin: user?.user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
