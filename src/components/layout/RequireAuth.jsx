import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

const RequireAuth = ({ children }) => {
	const [token] = useAuth();

	if (!token) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export { RequireAuth };
