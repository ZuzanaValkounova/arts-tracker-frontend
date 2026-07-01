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
import { ChartEmpty, axisTick, gridStroke, lineTooltipProps } from "./chartStyle";

// data: [{ periodStart, started, completed }]
const ActivityChart = ({ title, data, granularity }) => {
	const hasData = data.some((row) => row.started > 0 || row.completed > 0);
	const formattedLabel = (value) => formatPeriodLabel(value, granularity);
	// unique gradient ids per instance (projects vs tasks share this component)
	const uid = title.replace(/\W/g, "");

	return (
		<div className="rounded-lg border bg-card p-4">
			<h3 className="mb-3 text-sm font-semibold">{title}</h3>
			{!hasData ? (
				<ChartEmpty message="No activity in this period." />
			) : (
				<ResponsiveContainer width="100%" height={240}>
					<AreaChart data={data} margin={{ top: 8, right: 8 }}>
						<defs>
							<linearGradient id={`started-${uid}`} x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#a899db" stopOpacity={0.45} />
								<stop offset="100%" stopColor="#a899db" stopOpacity={0.02} />
							</linearGradient>
							<linearGradient id={`completed-${uid}`} x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#86b48f" stopOpacity={0.5} />
								<stop offset="100%" stopColor="#86b48f" stopOpacity={0.02} />
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
						<XAxis
							dataKey="periodStart"
							tickFormatter={formattedLabel}
							tick={axisTick}
							minTickGap={24}
						/>
						<YAxis allowDecimals={false} width={28} tick={axisTick} />
						<Tooltip {...lineTooltipProps} labelFormatter={formattedLabel} />
						<Legend iconType="plainline" wrapperStyle={{ fontSize: 12 }} />
						<Area
							type="monotone"
							dataKey="started"
							name="Started"
							stroke="#a899db"
							strokeWidth={2}
							fill={`url(#started-${uid})`}
						/>
						<Area
							type="monotone"
							dataKey="completed"
							name="Completed"
							stroke="#86b48f"
							strokeWidth={2}
							fill={`url(#completed-${uid})`}
						/>
					</AreaChart>
				</ResponsiveContainer>
			)}
		</div>
	);
};

export { ActivityChart };
