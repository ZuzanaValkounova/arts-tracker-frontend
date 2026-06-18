// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";

// import { register } from "../api/users";

// const RegisterPage = () => {
// 	const navigate = useNavigate();
// 	const [username, setUsername] = useState("");
// 	const [password, setPassword] = useState("");

// 	const registerMutation = useMutation({
// 		mutationFn: () => register({ username, password }),
// 		onSuccess: () => navigate("/login"),
// 		onError: () => alert("Failed to create account!"),
// 	});

// 	const handleSubmit = (e) => {
// 		e.preventDefault();
// 		registerMutation.mutate();
// 	};

// 	return (
// 		<form onSubmit={handleSubmit}>
// 			<Link to="/">Back to main page</Link>
// 			<input
// 				type="text"
// 				placeholder="Username"
// 				value={username}
// 				onChange={(e) => setUsername(e.target.value)}
// 			/>
// 			<input
// 				type="password"
// 				placeholder="Password"
// 				value={password}
// 				onChange={(e) => setPassword(e.target.value)}
// 			/>
// 			<button type="submit" disabled={!username || !password || registerMutation.isPending}>
// 				{registerMutation.isPending ? "Creating Account..." : "Create Account"}
// 			</button>
// 		</form>
// 	);
// };

// export { RegisterPage };
