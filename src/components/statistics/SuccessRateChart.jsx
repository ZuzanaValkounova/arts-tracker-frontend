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
						<defs>
							<linearGradient id="successGradient" x1="0" y1="0" x2="1" y2="1">
								<stop offset="0%" stopColor="#86b48f" />
								<stop offset="100%" stopColor="#5fa9a0" />
							</linearGradient>
						</defs>
						<PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
						<RadialBar
							background={{ fill: "var(--muted)" }}
							dataKey="value"
							cornerRadius={10}
							fill="url(#successGradient)"
							angleAxisId={0}
						/>
					</RadialBarChart>
				</ResponsiveContainer>
				<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
					<span className="text-3xl leading-none font-bold tabular-nums text-emerald-400">
						{rate}
						<span className="text-xl">%</span>
					</span>
					<span className="mt-1 text-[11px] text-muted-foreground">of projects completed</span>
				</div>
			</div>
		</div>
	);
};

export { SuccessRateChart };
