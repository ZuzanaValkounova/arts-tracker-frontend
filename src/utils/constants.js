const PROJECT_STATUSES = ["planned", "inProgress", "paused", "completed", "archived"];
const TASK_STATUSES = ["planned", "inProgress", "paused", "completed"];
const PRIORITIES = ["low", "medium", "high"];

const STATUS_META = {
	planned: { label: "Planned", className: "bg-stone-400/15 text-stone-300" },
	inProgress: { label: "In progress", className: "bg-violet-400/15 text-violet-200" },
	paused: { label: "Paused", className: "bg-amber-400/15 text-amber-200" },
	completed: { label: "Completed", className: "bg-emerald-400/15 text-emerald-200" },
	archived: { label: "Archived", className: "bg-zinc-400/15 text-zinc-300" },
};

const PRIORITY_META = {
	low: { label: "Low", className: "bg-stone-400/15 text-stone-300" },
	medium: { label: "Medium", className: "bg-amber-400/15 text-amber-200" },
	high: { label: "High", className: "bg-rose-400/15 text-rose-200" },
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
