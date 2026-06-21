import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

// data: successRate (single number, completed / non-archived projects in %)
const SuccessRateChart = ({ data }) => {
	const rate = Math.round(data ?? 0);
	const chartData = [{ name: "success", value: rate }];

	return (
		<div className="rounded-lg border bg-card p-4">
			<h3 className="mb-3 text-sm font-semibold">Success rate</h3>
			<div className="relative">
				<ResponsiveContainer width="100%" height={220}>
					<RadialBarChart
						innerRadius="70%"
						outerRadius="100%"
						data={chartData}
						startAngle={90}
						endAngle={-270}>
						{/* domain 0–100 makes the bar length represent the percentage */}
						<PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
						<RadialBar background dataKey="value" cornerRadius={8} fill="#22c55e" angleAxisId={0} />
					</RadialBarChart>
				</ResponsiveContainer>
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center text-2xl font-bold">
					{rate} %
				</div>
			</div>
		</div>
	);
};

export { SuccessRateChart };
