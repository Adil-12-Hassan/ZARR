import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { orderAPI } from "../api/api";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // - Fetch current user's orders from the API -─
  const fetchMyOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await orderAPI.getMine();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // - Fetch all orders (admin) ---------
  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderAPI.getAll();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // - Update order status (admin) -------─
  const updateStatus = useCallback(async (orderId, status) => {
    try {
      const updated = await orderAPI.updateStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  // - Load user orders when they log in ----─
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyOrders();
    } else {
      setOrders([]);
    }
  }, [isAuthenticated, fetchMyOrders]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        error,
        fetchMyOrders,
        fetchAllOrders,
        updateStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside <OrdersProvider>");
  return ctx;
}
