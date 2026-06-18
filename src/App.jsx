import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthContextProvider } from "./contexts/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { RequireAuth } from "./components/layout/RequireAuth";

import { DashboardPage } from "./pages/DashboardPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { InventoryPage } from "./pages/InventoryPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { TagsPage } from "./pages/TagsPage";
// import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{ path: "/login", element: <LoginPage /> },
	// { path: "/register", element: <RegisterPage /> },
	{
		element: (
			<RequireAuth>
				<AppLayout />
			</RequireAuth>
		),
		children: [
			{ path: "/", element: <DashboardPage /> },
			{ path: "/projects/:projectId", element: <ProjectDetailPage /> },
			{ path: "/inventory", element: <InventoryPage /> },
			{ path: "/resources", element: <ResourcesPage /> },
			{ path: "/statistics", element: <StatisticsPage /> },
			{ path: "/tags", element: <TagsPage /> },
			// { path: "/*", element: <NotFoundPage /> }, TODO
		],
	},
]);

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthContextProvider>
				<RouterProvider router={router} />
			</AuthContextProvider>
		</QueryClientProvider>
	);
}

export default App;
