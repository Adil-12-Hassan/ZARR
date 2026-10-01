import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { authAPI, userAPI } from "../api/api";

const AuthContext = createContext(null);

// Regular users: localStorage — persists across browser restarts, like a
// normal "stay logged in" e-commerce session (backend token also expires
// after JWT_USER_EXPIRES_IN, default 7d).
const USER_KEY = "zarr_auth_user";

// Admin: sessionStorage instead of localStorage. sessionStorage is wiped
// automatically when the tab/browser closes — that's what gives you the
// "GCUF portal" behaviour (close the site, session's gone) without any
// extra code, because the browser does it for us. Backend also caps the
// admin token itself at JWT_ADMIN_EXPIRES_IN (default 2h) so it can't be
// kept alive forever even if the tab stays open.
const ADMIN_KEY = "zarr_auth_admin";

// On top of both of those: if the admin is logged in but doesn't touch the
// page for this long, we log them out client-side even though the tab is
// still open — this is the "forgot to log out" case.
const ADMIN_IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function readStorage(key, storage) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadInitialSession() {
  // Admin session (if any) takes priority when both happen to be present,
  // since only one role is "active" in a tab at a time in this app.
  const admin = readStorage(ADMIN_KEY, sessionStorage);
  if (admin) return { data: admin, isAdminSession: true };

  const user = readStorage(USER_KEY, localStorage);
  if (user) return { data: user, isAdminSession: false };

  return { data: null, isAdminSession: false };
}

function persistSession(data, isAdminSession) {
  const serialized = JSON.stringify(data);
  if (isAdminSession) {
    sessionStorage.setItem(ADMIN_KEY, serialized);
    localStorage.removeItem(USER_KEY);
  } else {
    localStorage.setItem(USER_KEY, serialized);
    sessionStorage.removeItem(ADMIN_KEY);
  }
}

export function AuthProvider({ children }) {
  const initial = loadInitialSession();
  const [user, setUser] = useState(initial.data);
  const [isAdminSession, setIsAdminSession] = useState(initial.isAdminSession);
  const [loading, setLoading] = useState(Boolean(initial.data));
  const [error, setError] = useState(null);
  const idleTimerRef = useRef(null);

  const refreshUser = useCallback(async () => {
    const profile = await authAPI.me();
    setUser((current) => current ? { ...current, user: profile } : current);
    return profile;
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const profile = await userAPI.updateMe(updates);
    setUser((current) => current ? { ...current, user: profile } : current);
    return profile;
  }, []);

  useEffect(() => {
    if (!initial.data) return undefined;

    let active = true;
    authAPI.me()
      .then((profile) => {
        if (active) setUser((current) => current ? { ...current, user: profile } : current);
      })
      .catch((err) => {
        if (active && err.status === 401) {
          setUser(null);
          setIsAdminSession(false);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
    // Validate only the session found during initial app startup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to the correct storage whenever user/isAdminSession changes.
  useEffect(() => {
    if (user && isAdminSession) {
      sessionStorage.setItem(ADMIN_KEY, JSON.stringify(user));
      localStorage.removeItem(USER_KEY);
    } else if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      sessionStorage.removeItem(ADMIN_KEY);
    } else {
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(ADMIN_KEY);
    }
  }, [user, isAdminSession]);

  // --- Idle timeout, admin only -----------------------------------------
  useEffect(() => {
    if (!user || !isAdminSession) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      return;
    }

    const resetTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        // Idle too long — log out even though the tab is still open.
        setUser(null);
        setIsAdminSession(false);
        setError("You were logged out after 30 minutes of inactivity.");
      }, ADMIN_IDLE_TIMEOUT_MS);
    };

    const activityEvents = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    activityEvents.forEach((evt) => window.addEventListener(evt, resetTimer));
    resetTimer();

    return () => {
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetTimer));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdminSession]);

  // --- Register -----------------------------------------------------------
  const register = async ({ username, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.register({ username, email, password });
      persistSession(data, false);
      setIsAdminSession(false);
      setUser(data); // { token, user: { ... } }
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // --- Login (customer) ----------------------------------------------------
  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.login({ email, password });
      persistSession(data, false);
      setIsAdminSession(false);
      setUser(data);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // --- Admin login -----------------------------------------------------------
  const adminLogin = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.adminLogin({ email, password });
      persistSession(data, true);
      setIsAdminSession(true);
      setUser(data);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // --- Logout ------------------------------------------------------------
  const logout = () => {
    // Tell the server too — this bumps tokenVersion so the token can't be
    // reused even if it somehow leaked, not just deleted client-side.
    authAPI.logout().catch(() => {});
    setUser(null);
    setIsAdminSession(false);
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
        refreshUser,
        updateProfile,
        logout,
        isAuthenticated: Boolean(user),
        isAdmin: isAdminSession && user?.user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
