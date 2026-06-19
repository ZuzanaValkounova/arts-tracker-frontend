import { NavLink } from "react-router-dom";

// TODO replace emoji with icon library
const DEFAULT_ITEMS = [
	{ to: "/", label: "Projects", icon: "🏠", end: true },
	{ to: "/inventory", label: "Inventory", icon: "🧰" },
	{ to: "/resources", label: "Resources", icon: "🖼️" },
	{ to: "/statistics", label: "Statistics", icon: "📊" },
	{ to: "/tags", label: "Tags", icon: "🏷️" },
];

const Sidebar = ({ items = DEFAULT_ITEMS, footer }) => {
	return (
		<aside className="flex h-screen w-52 shrink-0 flex-col border-r border-gray-200 bg-white">
			<div className="px-4 py-5 text-base font-bold">Arts Tracker</div>
			<nav className="flex flex-1 flex-col gap-1 px-2">
				{items.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						end={item.end}
						className={({ isActive }) =>
							`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
								isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
							}`
						}>
						<span>{item.icon}</span>
						{item.label}
					</NavLink>
				))}
			</nav>
			{footer ? <div className="border-t border-gray-200 p-2">{footer}</div> : null}
		</aside>
	);
};

export { Sidebar };
