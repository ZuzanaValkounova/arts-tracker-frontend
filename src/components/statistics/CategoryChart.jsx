import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { ChartEmpty, axisTick, gridStroke, barTooltipProps } from "./chartStyle";

// data: byCategory [{ _id, count, name, icon }]
const CategoryChart = ({ data }) => {
	const chartData = data
		.map(({ _id, count, name }) => ({
			id: _id ?? "none",
			name: name ?? "No category",
			count,
		}))
		// fixed order (alphabetical, no category last)
		.sort((a, b) => (a.id === "none" ? 1 : b.id === "none" ? -1 : a.name.localeCompare(b.name)));

	return (
		<div className="rounded-lg border bg-card p-4">
			<h3 className="mb-3 text-sm font-semibold">Projects by category</h3>
			{chartData.length === 0 ? (
				<ChartEmpty message="No categories to chart yet." />
			) : (
				<ResponsiveContainer width="100%" height={Math.max(140, chartData.length * 40)}>
					<BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 8 }}>
						<defs>
							<linearGradient id="categoryGradient" x1="0" y1="0" x2="1" y2="0">
								<stop offset="0%" stopColor="#8579cf" />
								<stop offset="100%" stopColor="#b3a9e6" />
							</linearGradient>
						</defs>
						<CartesianGrid horizontal={false} strokeDasharray="3 3" stroke={gridStroke} />
						<XAxis type="number" allowDecimals={false} tick={axisTick} />
						<YAxis type="category" dataKey="name" width={120} tick={axisTick} />
						<Tooltip {...barTooltipProps} />
						<Bar dataKey="count" fill="url(#categoryGradient)" radius={[0, 5, 5, 0]} barSize={18} />
					</BarChart>
				</ResponsiveContainer>
			)}
		</div>
	);
};

export { CategoryChart };
