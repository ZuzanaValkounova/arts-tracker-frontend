import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { STATUS_META } from "../../utils/constants";

const STATUS_COLORS = {
	planned: "#bcb3a8",
	inProgress: "#9b8fd4",
	paused: "#d9b86c",
	completed: "#86b48f",
	archived: "#8a857e",
};

// data: byStatus [{ _id: "completed", count: 3 }]
const StatusPieChart = ({ data }) => {
	const chartData = data
		.filter(({ count }) => count > 0)
		.map(({ _id, count }) => ({
			status: _id,
			name: STATUS_META[_id]?.label ?? "Unknown",
			value: count,
		}));

	return (
		<div className="rounded-lg border bg-card p-4">
			<h3 className="mb-3 text-sm font-semibold">Projects by status</h3>
			{chartData.length === 0 ? (
				<p className="text-sm text-muted-foreground">No data</p>
			) : (
				<ResponsiveContainer width="100%" height={220}>
					<PieChart>
						<Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
							{chartData.map((entry) => (
								<Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "#e5e7eb"} />
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			)}
		</div>
	);
};

export { StatusPieChart };
