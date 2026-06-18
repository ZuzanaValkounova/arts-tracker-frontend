import { STATUS_META } from "../../utils/constants";

// hex values matching STATUS_META tailwind colors
// TODO: swap for a chart library (e.g. recharts)
const STATUS_COLORS = {
	planned: "#cbd5e1",
	inProgress: "#3b82f6",
	paused: "#f59e0b",
	completed: "#22c55e",
	archived: "#a1a1aa",
};

// data: byStatus [{ _id: "completed", count: 3 }]
const StatusPieChart = ({ data }) => {
	const total = data.reduce((acc, { count }) => acc + count, 0);

	const visible = data.filter(({ count }) => count > 0);
	const segments = visible.map(({ _id, count }, index) => {
		const before = visible.slice(0, index).reduce((acc, entry) => acc + entry.count, 0);
		const from = (before / total) * 360;
		const to = ((before + count) / total) * 360;
		return `${STATUS_COLORS[_id] ?? "#e5e7eb"} ${from}deg ${to}deg`;
	});

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-4">
			<h3 className="mb-3 text-sm font-semibold">Projects by status</h3>
			{total === 0 ? (
				<p className="text-sm text-gray-400">No data</p>
			) : (
				<div className="flex items-center gap-4">
					<div
						className="h-32 w-32 shrink-0 rounded-full"
						style={{ background: `conic-gradient(${segments.join(", ")})` }}
					/>
					<ul className="flex flex-col gap-1 text-xs">
						{data.map(({ _id, count }) => (
							<li key={_id ?? "none"} className="flex items-center gap-1.5">
								<span
									className="h-2.5 w-2.5 rounded-sm"
									style={{ backgroundColor: STATUS_COLORS[_id] ?? "#e5e7eb" }}
								/>
								{STATUS_META[_id]?.label ?? "Unknown"} — {count}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export { StatusPieChart };
