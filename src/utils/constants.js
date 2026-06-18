const PROJECT_STATUSES = ["planned", "inProgress", "paused", "completed", "archived"];
const TASK_STATUSES = ["planned", "inProgress", "paused", "completed"];
const PRIORITIES = ["low", "medium", "high"];

const STATUS_META = {
	planned: { label: "Planned", className: "bg-slate-100 text-slate-700" },
	inProgress: { label: "In progress", className: "bg-blue-100 text-blue-700" },
	paused: { label: "Paused", className: "bg-amber-100 text-amber-700" },
	completed: { label: "Completed", className: "bg-green-100 text-green-700" },
	archived: { label: "Archived", className: "bg-zinc-200 text-zinc-500" },
};

const PRIORITY_META = {
	low: { label: "Low", className: "bg-gray-100 text-gray-600" },
	medium: { label: "Medium", className: "bg-amber-100 text-amber-700" },
	high: { label: "High", className: "bg-red-100 text-red-700" },
};

const INVENTORY_TYPES = ["consumable", "tool"];
const INVENTORY_STATUSES = ["wishlist", "owned"];

export {
	PROJECT_STATUSES,
	TASK_STATUSES,
	PRIORITIES,
	STATUS_META,
	PRIORITY_META,
	INVENTORY_TYPES,
	INVENTORY_STATUSES,
};
