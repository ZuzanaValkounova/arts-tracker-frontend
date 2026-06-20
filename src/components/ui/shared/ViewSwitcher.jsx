const VIEW_LABELS = {
	list: "List",
	kanban: "Kanban",
	calendar: "Calendar",
};

const ViewSwitcher = ({ value, onChange, options = ["list", "kanban"] }) => {
	return (
		<div className="inline-flex rounded-lg border border-gray-300 p-0.5">
			{options.map((view) => (
				<button
					key={view}
					type="button"
					onClick={() => onChange(view)}
					className={`rounded-md px-3 py-1 text-sm ${
						value === view ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
					}`}>
					{VIEW_LABELS[view] ?? view}
				</button>
			))}
		</div>
	);
};

export { ViewSwitcher };
