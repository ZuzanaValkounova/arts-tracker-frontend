import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// data: durationByCategory [{ _id, count, name, icon, avgDurationDays }]
const DurationByCategoryChart = ({ data = [] }) => {
	const chartData = data
		.filter((d) => d.avgDurationDays != null)
		.map(({ _id, name, avgDurationDays, count }) => ({
			id: _id ?? "none",
			name: name ?? "No category",
			days: avgDurationDays,
			count,
		}));

	return (
		<div className="rounded-lg border bg-card p-4">
			<h3 className="mb-3 text-sm font-semibold">Avg. duration by category</h3>
			{chartData.length === 0 ? (
				<p className="text-sm text-muted-foreground">No completed projects with dates yet</p>
			) : (
				<ResponsiveContainer width="100%" height={Math.max(140, chartData.length * 36)}>
					<BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 16 }}>
						<XAxis type="number" allowDecimals={false} unit="d" />
						<YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
						<Tooltip
							formatter={(value, _n, item) => [
								`${value} days · ${item?.payload?.count ?? 0} project(s)`,
								"Avg. duration",
							]}
						/>
						<Bar dataKey="days" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
					</BarChart>
				</ResponsiveContainer>
			)}
		</div>
	);
};

export { DurationByCategoryChart };
