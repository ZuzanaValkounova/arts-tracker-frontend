import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { STATUS_META } from "../../utils/constants";

const STATUS_COLORS = {
	planned: "#cbd5e1",
	inProgress: "#3b82f6",
	paused: "#f59e0b",
	completed: "#22c55e",
	archived: "#a1a1aa",
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
		<div className="rounded-lg border border-gray-200 bg-white p-4">
			<h3 className="mb-3 text-sm font-semibold">Projects by status</h3>
			{chartData.length === 0 ? (
				<p className="text-sm text-gray-400">No data</p>
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
