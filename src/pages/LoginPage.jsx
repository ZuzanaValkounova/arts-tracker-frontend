import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { login } from "../api/users";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation.mutate();
	};

	return (
		<div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-lg">Welcome back</CardTitle>
					<CardDescription>Log in to your account.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								placeholder="Username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								autoComplete="username"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="current-password"
							/>
						</div>
						<Button type="submit" disabled={!username || !password || loginMutation.isPending}>
							{loginMutation.isPending ? "Logging in…" : "Log in"}
						</Button>
						<Link
							to="/"
							className="text-center text-xs text-muted-foreground hover:text-foreground">
							Back to main page
						</Link>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export { LoginPage };
