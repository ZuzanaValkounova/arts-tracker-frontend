import { BarChart3 } from "lucide-react";

// cozy palette shared by every chart
export const CHART_COLORS = {
	lavender: "#9b8fd4",
	sage: "#86b48f",
	terracotta: "#d99a6c",
	gold: "#d9b86c",
	blue: "#7fa8c9",
	rose: "#cf8e8e",
	stone: "#bcb3a8",
	muted: "#8a857e",
};

export const DIFFICULTY_COLORS = ["#86b48f", "#b3b46a", "#d9b86c", "#df9457", "#d9654e"];

// dark, rounded tooltip
const tooltipBase = {
	contentStyle: {
		background: "var(--popover)",
		border: "1px solid var(--border)",
		borderRadius: "10px",
		boxShadow: "0 10px 28px rgb(0 0 0 / 0.38)",
		fontSize: 12,
		padding: "8px 10px",
		color: "var(--popover-foreground)",
	},
	labelStyle: { color: "var(--foreground)", fontWeight: 600, marginBottom: 2 },
	itemStyle: { color: "var(--muted-foreground)", padding: 0 },
};

// bar charts get a highlight rectangle
export const barTooltipProps = {
	...tooltipBase,
	cursor: { fill: "var(--accent)", fillOpacity: 0.35 },
};
export const lineTooltipProps = {
	...tooltipBase,
	cursor: { stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "3 3" },
};
export const pieTooltipProps = tooltipBase;

export const axisTick = { fontSize: 12, fill: "var(--muted-foreground)" };
export const gridStroke = "var(--border)";

// empty state
export const ChartEmpty = ({ message }) => (
	<div className="flex h-50 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
		<BarChart3 className="size-8 opacity-35" />
		<p className="max-w-[18rem] text-sm">{message}</p>
	</div>
);
