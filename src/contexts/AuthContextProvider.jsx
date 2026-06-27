import { useState, useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import { AuthContext } from "./AuthContext";

// returns true when the token has an exp already in the past
const isTokenExpired = (token) => {
	try {
		const { exp } = jwtDecode(token);
		if (!exp) return false;
		return exp * 1000 <= Date.now();
	} catch {
		return true;
	}
};

const readStoredToken = () => {
	const stored = localStorage.getItem("token");
	if (!stored) return null;
	if (isTokenExpired(stored)) {
		localStorage.removeItem("token");
		return null;
	}
	return stored;
};

const AuthContextProvider = ({ children }) => {
	const [token, setTokenState] = useState(readStoredToken);

	const setToken = useCallback((newToken) => {
		if (newToken) {
			localStorage.setItem("token", newToken);
		} else {
			localStorage.removeItem("token");
		}
		setTokenState(newToken);
	}, []);

	useEffect(() => {
		if (!token) return;
		let msUntilExpiry;
		try {
			const { exp } = jwtDecode(token);
			if (!exp) return;
			msUntilExpiry = Math.max(0, exp * 1000 - Date.now());
		} catch {
			msUntilExpiry = 0;
		}
		const timeoutId = setTimeout(() => setToken(null), msUntilExpiry);
		return () => clearTimeout(timeoutId);
	}, [token, setToken]);

	return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
};

export { AuthContextProvider };
