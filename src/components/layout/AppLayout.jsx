import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Sidebar } from "./Sidebar";
import { UserMenu } from "./UserMenu";
import { getCurrentUser } from "../../api/users";
import { useAuth } from "../../contexts/useAuth";

const AppLayout = () => {
	const [token, setToken] = useAuth();
	const navigate = useNavigate();

	const userQuery = useQuery({
		queryKey: ["currentUser"],
		queryFn: () => getCurrentUser(token),
		enabled: Boolean(token),
	});

	useEffect(() => {
		if (userQuery.error?.status === 401) {
			setToken(null);
			navigate("/login", { replace: true });
		}
	}, [userQuery.error, setToken, navigate]);

	const handleLogout = () => {
		setToken(null);
		navigate("/login");
	};

	return (
		<TooltipProvider delayDuration={0}>
			<SidebarProvider defaultOpen={false}>
				<Sidebar footer={<UserMenu user={userQuery.data} onLogout={handleLogout} />} />
				<SidebarInset className="min-w-0">
					<header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
						<SidebarTrigger />
					</header>
					<main className="flex-1 overflow-y-auto p-6">
						<div className="mx-auto w-full max-w-425">
							<Outlet />
						</div>
					</main>
				</SidebarInset>
			</SidebarProvider>
		</TooltipProvider>
	);
};

export { AppLayout };
