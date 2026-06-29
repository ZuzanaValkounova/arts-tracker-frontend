import {
	BarChart,
	Bar,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Flame } from "lucide-react";

import { ChartEmpty, axisTick, gridStroke, barTooltipProps, DIFFICULTY_COLORS } from "./chartStyle";

const DifficultyTick = ({ x, y, payload }) => {
	const value = payload.value;
	if (value === "Unrated") {
		return (
			<text x={x} y={y + 14} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">
				Unrated
			</text>
		);
	}
	const level = Number(value);
	const size = 13;
	const gap = 1;
	const totalWidth = level * size + (level - 1) * gap;
	const startX = x - totalWidth / 2;
	const color = DIFFICULTY_COLORS[level - 1];
	return (
		<g transform={`translate(${startX}, ${y + 4})`}>
			{Array.from({ length: level }).map((_, index) => (
				<Flame
					key={index}
					x={index * (size + gap)}
					y={0}
					width={size}
					height={size}
					color={color}
					fill={color}
					fillOpacity={0.9}
					strokeWidth={1.5}
				/>
			))}
		</g>
	);
};

// data: byDifficulty [{ _id: 1..5 | null, count }]
const DifficultyChart = ({ data }) => {
	const byLevel = new Map(data.map(({ _id, count }) => [_id, count]));
	const chartData = [1, 2, 3, 4, 5].map((level) => ({
		name: String(level),
		count: byLevel.get(level) ?? 0,
		color: DIFFICULTY_COLORS[level - 1],
	}));

	// projects without a difficulty grouped under _id null
	const unrated = data.find(({ _id }) => _id == null);
	if (unrated) chartData.push({ name: "Unrated", count: unrated.count, color: "#8a857e" });

	const hasData = chartData.some(({ count }) => count > 0);

	return (
		<div className="rounded-lg border bg-card p-4">
			<h3 className="mb-3 text-sm font-semibold">Projects by difficulty</h3>
			{!hasData ? (
				<ChartEmpty message="No rated projects yet." />
			) : (
				<ResponsiveContainer width="100%" height={220}>
					<BarChart data={chartData} margin={{ top: 8, right: 8 }}>
						<CartesianGrid vertical={false} strokeDasharray="3 3" stroke={gridStroke} />
						<XAxis dataKey="name" tick={<DifficultyTick />} interval={0} height={28} />
						<YAxis allowDecimals={false} width={28} tick={axisTick} />
						<Tooltip
							{...barTooltipProps}
							labelFormatter={(value) =>
								value === "Unrated" ? "Unrated" : `Difficulty ${value}/5`
							}
						/>
						<Bar dataKey="count" radius={[5, 5, 0, 0]} barSize={36}>
							{chartData.map((entry) => (
								<Cell key={entry.name} fill={entry.color} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			)}
		</div>
	);
};

export { DifficultyChart };
