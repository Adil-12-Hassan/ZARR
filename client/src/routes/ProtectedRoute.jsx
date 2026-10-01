import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ requiredRole, redirectTo = "/login" }) {
	const { isAuthenticated, loading, user } = useAuth();
	const role = user?.user?.role ?? user?.role;

	if (loading) {
		return <div className="route-loading" role="status">Checking your session…</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to={redirectTo} replace />;
	}

	if (requiredRole && role !== requiredRole) {
		return <Navigate to={redirectTo} replace />;
	}

	return <Outlet />;
}

export default ProtectedRoute;
