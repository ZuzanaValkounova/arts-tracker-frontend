import { request } from "./client";

// const register = ({ username, password }) =>
// 	request("/api/users/register", { method: "POST", body: { username, password } });

const login = ({ username, password }) =>
	request("/api/users/login", { method: "POST", body: { username, password } });

const getCurrentUser = (token) => request("/api/users/current", { method: "GET", token });

const updateCurrentUser = (token, values) =>
	request("/api/users/current", { method: "PATCH", token, body: values });

const getAvatars = (token) => request("/api/users/avatars", { method: "GET", token });

export { /*register,*/ login, getCurrentUser, updateCurrentUser, getAvatars };
