import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ requiredRole, redirectTo = "/login" }) {
	const { isAuthenticated, user } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to={redirectTo} replace />;
	}

	if (requiredRole && user?.role !== requiredRole) {
		return <Navigate to={redirectTo} replace />;
	}

	return <Outlet />;
}

export default ProtectedRoute;
