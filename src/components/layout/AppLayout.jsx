import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Sidebar } from "./Sidebar";
import { UserMenu } from "./UserMenu";
import { getCurrentUser } from "../../api/users";
import { useAuth } from "../../contexts/AuthContext";

const AppLayout = () => {
	const [token, setToken] = useAuth();
	const navigate = useNavigate();

	const userQuery = useQuery({
		queryKey: ["currentUser"],
		queryFn: () => getCurrentUser(token),
		enabled: Boolean(token),
	});

	const handleLogout = () => {
		setToken(null);
		navigate("/login");
	};

	return (
		<div className="flex min-h-screen bg-gray-50">
			<Sidebar footer={<UserMenu user={userQuery.data} onLogout={handleLogout} />} />
			<main className="flex-1 overflow-y-auto p-6">
				<Outlet />
			</main>
		</div>
	);
};

export { AppLayout };
