import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { login } from "../api/users";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [, setToken] = useAuth();

	const loginMutation = useMutation({
		mutationFn: () => login({ username, password }),
		onSuccess: (data) => {
			setToken(data.token);
			navigate("/");
		},
		onError: () => alert("Failed to login!"),
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation.mutate();
	};

	return (
		<form onSubmit={handleSubmit}>
			<Link to="/">Back to main page</Link>
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button type="submit" disabled={!username || !password || loginMutation.isPending}>
				{loginMutation.isPending ? "Logging in..." : "Log in"}
			</button>
		</form>
	);
};

export { LoginPage };
