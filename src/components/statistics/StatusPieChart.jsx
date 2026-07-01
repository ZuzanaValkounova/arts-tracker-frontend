import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { STATUS_META, PROJECT_STATUSES } from "../../utils/constants";
import { ChartEmpty, pieTooltipProps } from "./chartStyle";

const STATUS_COLORS = {
	planned: "#bcb3a8",
	inProgress: "#9b8fd4",
	paused: "#d9b86c",
	completed: "#86b48f",
	archived: "#8a857e",
};

// data: byStatus [{ _id: "completed", count: 3 }]
const StatusPieChart = ({ data }) => {
	// build in a fixed status order
	const countByStatus = new Map(data.map(({ _id, count }) => [_id, count]));
	const chartData = PROJECT_STATUSES.map((status) => ({
		status,
		name: STATUS_META[status]?.label ?? "Unknown",
		value: countByStatus.get(status) ?? 0,
	})).filter(({ value }) => value > 0);

	const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

	return (
		<div className="rounded-lg border bg-card p-4">
			<h3 className="mb-3 text-sm font-semibold">Projects by status</h3>
			{chartData.length === 0 ? (
				<ChartEmpty message="No projects to chart yet." />
			) : (
				<div className="relative">
					<ResponsiveContainer width="100%" height={220}>
						<PieChart>
							<Pie
								data={chartData}
								dataKey="value"
								nameKey="name"
								innerRadius={55}
								outerRadius={82}
								paddingAngle={2}
								cornerRadius={4}
								stroke="var(--card)"
								strokeWidth={2}>
								{chartData.map((entry) => (
									<Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "#e5e7eb"} />
								))}
							</Pie>
							<Tooltip
								{...pieTooltipProps}
								wrapperStyle={{ zIndex: 50 }}
								formatter={(value, name) => [
									`${value} · ${Math.round((value / total) * 100)}%`,
									name,
								]}
							/>
							<Legend iconType="circle" iconSize={9} />
						</PieChart>
					</ResponsiveContainer>
					<div className="pointer-events-none absolute inset-0 bottom-8 flex flex-col items-center justify-center">
						<span className="text-2xl leading-none font-bold tabular-nums">{total}</span>
						<span className="text-[11px] text-muted-foreground">projects</span>
					</div>
				</div>
			)}
		</div>
	);
};

export { StatusPieChart };
