import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { ChartEmpty, axisTick, gridStroke, barTooltipProps } from "./chartStyle";

// data: durationByCategory [{ _id, count, name, icon, avgDurationDays }]
const DurationByCategoryChart = ({ data = [] }) => {
	const chartData = data
		.filter((d) => d.avgDurationDays != null)
		.map(({ _id, name, avgDurationDays, count }) => ({
			id: _id ?? "none",
			name: name ?? "No category",
			days: avgDurationDays,
			count,
		}))
		// fixed order (alphabetical, no category last)
		.sort((a, b) => (a.id === "none" ? 1 : b.id === "none" ? -1 : a.name.localeCompare(b.name)));

	return (
		<div className="rounded-lg border bg-card p-4">
			<h3 className="mb-3 text-sm font-semibold">Avg. duration by category</h3>
			{chartData.length === 0 ? (
				<ChartEmpty message="No completed projects with dates yet." />
			) : (
				<ResponsiveContainer width="100%" height={Math.max(140, chartData.length * 40)}>
					<BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 16 }}>
						<defs>
							<linearGradient id="durationGradient" x1="0" y1="0" x2="1" y2="0">
								<stop offset="0%" stopColor="#c07f8e" />
								<stop offset="100%" stopColor="#dba9b3" />
							</linearGradient>
						</defs>
						<CartesianGrid horizontal={false} strokeDasharray="3 3" stroke={gridStroke} />
						<XAxis type="number" allowDecimals={false} unit="d" tick={axisTick} />
						<YAxis type="category" dataKey="name" width={120} tick={axisTick} />
						<Tooltip
							{...barTooltipProps}
							formatter={(value, _n, item) => [
								`${value} days · ${item?.payload?.count ?? 0} project(s)`,
								"Avg. duration",
							]}
						/>
						<Bar dataKey="days" fill="url(#durationGradient)" radius={[0, 5, 5, 0]} barSize={18} />
					</BarChart>
				</ResponsiveContainer>
			)}
		</div>
	);
};

export { DurationByCategoryChart };
