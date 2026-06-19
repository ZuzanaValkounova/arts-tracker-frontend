import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// data: byDifficulty [{ _id: 1..5 | null, count }]
const DifficultyChart = ({ data }) => {
	const byLevel = new Map(data.map(({ _id, count }) => [_id, count]));
	const chartData = [1, 2, 3, 4, 5].map((level) => ({
		name: "★".repeat(level),
		count: byLevel.get(level) ?? 0,
	}));

	// projects without a difficulty grouped under _id null
	const unrated = data.find(({ _id }) => _id == null);
	if (unrated) chartData.push({ name: "Unrated", count: unrated.count });

	const hasData = chartData.some(({ count }) => count > 0);

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-4">
			<h3 className="mb-3 text-sm font-semibold">Projects by difficulty</h3>
			{!hasData ? (
				<p className="text-sm text-gray-400">No data</p>
			) : (
				<ResponsiveContainer width="100%" height={220}>
					<BarChart data={chartData} margin={{ top: 8, right: 8 }}>
						<XAxis dataKey="name" tick={{ fontSize: 12 }} />
						<YAxis allowDecimals={false} width={28} />
						<Tooltip />
						<Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			)}
		</div>
	);
};

export { DifficultyChart };
