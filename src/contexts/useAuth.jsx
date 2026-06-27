import { useContext } from "react";

import { AuthContext } from "./AuthContext";

// Returns [token, setToken] from the auth context.
const useAuth = () => {
	const { token, setToken } = useContext(AuthContext);
	return [token, setToken];
};

export { useAuth };
