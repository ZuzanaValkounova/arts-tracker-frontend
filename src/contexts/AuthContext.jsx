import { createContext, useState, useContext, useCallback } from "react";

const AuthContext = createContext({
	token: null,
	setToken: () => {},
});

// TODO: check expiry with jwt-decode and drop the token when it is already expired
const AuthContextProvider = ({ children }) => {
	const [token, setTokenState] = useState(() => localStorage.getItem("token"));

	const setToken = useCallback((newToken) => {
		if (newToken) {
			localStorage.setItem("token", newToken);
		} else {
			localStorage.removeItem("token");
		}
		setTokenState(newToken);
	}, []);

	return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
	const { token, setToken } = useContext(AuthContext);
	return [token, setToken];
};

export { AuthContext, AuthContextProvider, useAuth };
