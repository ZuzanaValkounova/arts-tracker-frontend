import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// data: byCategory [{ _id, count, name, icon }]
const CategoryChart = ({ data }) => {
	const chartData = data.map(({ _id, count, name }) => ({
		id: _id ?? "none",
		name: name ?? "No category",
		count,
	}));

	return (
		<div className="rounded-lg border bg-card p-4">
			<h3 className="mb-3 text-sm font-semibold">Projects by category</h3>
			{chartData.length === 0 ? (
				<p className="text-sm text-muted-foreground">No data</p>
			) : (
				<ResponsiveContainer width="100%" height={Math.max(140, chartData.length * 36)}>
					<BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 8 }}>
						<XAxis type="number" allowDecimals={false} />
						<YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
						<Tooltip />
						<Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
					</BarChart>
				</ResponsiveContainer>
			)}
		</div>
	);
};

export { CategoryChart };
