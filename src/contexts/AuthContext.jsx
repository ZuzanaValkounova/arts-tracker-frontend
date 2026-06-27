import { createContext } from "react";

const AuthContext = createContext({
	token: null,
	setToken: () => {},
});

export { AuthContext };
