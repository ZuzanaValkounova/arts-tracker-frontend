// stats: { projects: <GET /statistics/projects>, tasks: <GET /statistics/tasks> }
const SummaryCards = ({ stats }) => {
	const cards = [
		{ label: "Projects", value: stats.projects?.total ?? 0, hint: "all time" },
		{
			label: "Success rate",
			value: `${Math.round(stats.projects?.successRate ?? 0)} %`,
			hint: "completed / non-archived",
		},
		{
			label: "Avg. project duration",
			value: `${stats.projects?.averageDuration?.avgDurationDays ?? 0} d`,
			hint: "all time",
		},
		{
			label: "Projects completed",
			value: stats.projects?.completedInPeriod ?? 0,
			hint: "in selected period",
		},
		{ label: "Tasks", value: stats.tasks?.total ?? 0, hint: "all time" },
		{
			label: "Tasks completed",
			value: stats.tasks?.completedCount ?? 0,
			hint: "in selected period",
		},
	];

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
			{cards.map((card) => (
				<div key={card.label} className="rounded-lg border bg-card p-3">
					<div className="text-xs text-muted-foreground">{card.label}</div>
					<div className="text-xl font-bold">{card.value}</div>
					{card.hint && <div className="text-[10px] text-muted-foreground/70">{card.hint}</div>}
				</div>
			))}
		</div>
	);
};

export { SummaryCards };
