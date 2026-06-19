import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";

// data: byTag [{ _id, count, name, color }] (name/color null for no tag bucket)
const TagChart = ({ data }) => {
	const chartData = data.map(({ _id, count, name, color }) => ({
		id: _id ?? "none",
		name: name ?? "No tag",
		count,
		color: color ?? "#9ca3af",
	}));

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-4">
			<h3 className="mb-3 text-sm font-semibold">Projects by tag</h3>
			{chartData.length === 0 ? (
				<p className="text-sm text-gray-400">No data</p>
			) : (
				<ResponsiveContainer width="100%" height={Math.max(140, chartData.length * 36)}>
					<BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 8 }}>
						<XAxis type="number" allowDecimals={false} />
						<YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
						<Tooltip />
						<Bar dataKey="count" radius={[0, 4, 4, 0]}>
							{chartData.map((entry) => (
								<Cell key={entry.id} fill={entry.color} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			)}
		</div>
	);
};

export { TagChart };
