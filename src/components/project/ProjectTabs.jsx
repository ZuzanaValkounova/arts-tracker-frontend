const DEFAULT_TABS = [
	{ id: "tasks", label: "Tasks" },
	{ id: "moodboard", label: "Moodboard" },
	{ id: "materials", label: "Materials" },
	{ id: "resources", label: "Resources" },
];

const ProjectTabs = ({ value, onChange, tabs = DEFAULT_TABS }) => {
	return (
		<nav className="flex gap-1 border-b border-gray-200">
			{tabs.map((tab) => (
				<button
					key={tab.id}
					type="button"
					onClick={() => onChange(tab.id)}
					className={`-mb-px border-b-2 px-4 py-2 text-sm ${
						value === tab.id
							? "border-gray-900 font-medium text-gray-900"
							: "border-transparent text-gray-500 hover:text-gray-800"
					}`}>
					{tab.label}
				</button>
			))}
		</nav>
	);
};

export { ProjectTabs };
