import { LogOut } from "lucide-react";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usernameColor } from "@/lib/avatar";

const UserMenu = ({ user, onLogout }) => {
	const initial = user?.username?.[0]?.toUpperCase() ?? "?";

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							tooltip={user?.username}
							className="data-[state=open]:bg-sidebar-accent">
							<Avatar className="size-8 rounded-lg">
								{user?.image ? <AvatarImage src={user.image} alt={user.username} /> : null}
								<AvatarFallback
									className="rounded-lg font-semibold text-white"
									style={{ backgroundColor: usernameColor(user?.username) }}>
									{initial}
								</AvatarFallback>
							</Avatar>
							<span className="truncate text-sm font-medium">{user?.username ?? ""}</span>
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent side="right" align="end" className="min-w-44">
						<DropdownMenuLabel>{user?.username ?? "Account"}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive" onClick={onLogout}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};

export { UserMenu };
