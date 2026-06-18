// stats: { projects: <GET /statistics/projects>, tasks: <GET /statistics/tasks> }
const SummaryCards = ({ stats }) => {
	const cards = [
		{ label: "Projects", value: stats.projects?.total ?? 0 },
		{
			label: "Success rate",
			value: `${Math.round(stats.projects?.successRate ?? 0)} %`,
			hint: "completed / non-archived",
		},
		{ label: "Completed in period", value: stats.projects?.completedInPeriod ?? 0 },
		{
			label: "Avg. project duration",
			value: `${stats.projects?.averageDuration?.avgDurationDays ?? 0} d`,
		},
		{ label: "Tasks", value: stats.tasks?.total ?? 0 },
		{ label: "Tasks completed", value: stats.tasks?.completedCount ?? 0 },
	];

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
			{cards.map((card) => (
				<div key={card.label} className="rounded-lg border border-gray-200 bg-white p-3">
					<div className="text-xs text-gray-500">{card.label}</div>
					<div className="text-xl font-bold">{card.value}</div>
					{card.hint && <div className="text-[10px] text-gray-400">{card.hint}</div>}
				</div>
			))}
		</div>
	);
};

export { SummaryCards };
