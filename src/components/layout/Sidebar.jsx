import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ImageIcon, BarChart3, Tags } from "lucide-react";

import {
	Sidebar as SidebarRoot,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const DEFAULT_ITEMS = [
	{ to: "/", label: "Projects", icon: LayoutDashboard, end: true },
	{ to: "/inventory", label: "Inventory", icon: Package },
	{ to: "/resources", label: "Resources", icon: ImageIcon },
	{ to: "/statistics", label: "Statistics", icon: BarChart3 },
	{ to: "/tags", label: "Tags", icon: Tags },
];

const Sidebar = ({ items = DEFAULT_ITEMS, footer }) => {
	const { pathname } = useLocation();

	const isItemActive = (item) =>
		item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);

	return (
		<SidebarRoot collapsible="icon">
			<SidebarHeader>
				<div className="flex items-center gap-2 px-1 py-1">
					<div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
						AT
					</div>
					<span className="truncate font-semibold group-data-[collapsible=icon]:hidden">
						Arts Tracker
					</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.to}>
									<SidebarMenuButton asChild isActive={isItemActive(item)} tooltip={item.label}>
										<Link to={item.to}>
											<item.icon />
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			{footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
		</SidebarRoot>
	);
};

export { Sidebar };
