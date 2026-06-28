import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

import { formatPeriodLabel } from "../../utils/statistics";

// data: [{ periodStart, created, completed }]
const ActivityChart = ({ title, data, granularity }) => {
	const hasData = data.some((row) => row.created > 0 || row.completed > 0);
	const formattedLabel = (value) => formatPeriodLabel(value, granularity);

	return (
		<div className="rounded-lg border bg-card p-4">
			<h3 className="mb-3 text-sm font-semibold">{title}</h3>
			{!hasData ? (
				<p className="text-sm text-muted-foreground">No activity in this period</p>
			) : (
				<ResponsiveContainer width="100%" height={240}>
					<AreaChart data={data} margin={{ top: 8, right: 8 }}>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />
						<XAxis
							dataKey="periodStart"
							tickFormatter={formattedLabel}
							tick={{ fontSize: 11 }}
							minTickGap={24}
						/>
						<YAxis allowDecimals={false} width={28} />
						<Tooltip labelFormatter={formattedLabel} />
						<Legend />
						<Area
							type="monotone"
							dataKey="created"
							name="Created"
							stroke="#a899db"
							fill="#a899db"
							fillOpacity={0.15}
						/>
						<Area
							type="monotone"
							dataKey="completed"
							name="Completed"
							stroke="#86b48f"
							fill="#86b48f"
							fillOpacity={0.25}
						/>
					</AreaChart>
				</ResponsiveContainer>
			)}
		</div>
	);
};

export { ActivityChart };
