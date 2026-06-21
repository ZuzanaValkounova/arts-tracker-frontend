import { cn } from "@/lib/utils";

const DEFAULT_TABS = [
	{ id: "tasks", label: "Tasks" },
	{ id: "moodboard", label: "Moodboard" },
	{ id: "materials", label: "Materials" },
	{ id: "resources", label: "Resources" },
];

const ProjectTabs = ({ value, onChange, tabs = DEFAULT_TABS }) => {
	return (
		<nav className="flex gap-1 border-b">
			{tabs.map((tab) => (
				<button
					key={tab.id}
					type="button"
					onClick={() => onChange(tab.id)}
					className={cn(
						"-mb-px border-b-2 px-4 py-2 text-sm transition-colors",
						value === tab.id
							? "border-foreground font-medium text-foreground"
							: "border-transparent text-muted-foreground hover:text-foreground",
					)}>
					{tab.label}
				</button>
			))}
		</nav>
	);
};

export { ProjectTabs };
