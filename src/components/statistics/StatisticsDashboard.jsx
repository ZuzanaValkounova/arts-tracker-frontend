import { SummaryCards } from "./SummaryCards";
import { StatusPieChart } from "./StatusPieChart";
import { SuccessRateChart } from "./SuccessRateChart";
import { CategoryChart } from "./CategoryChart";
import { DifficultyChart } from "./DifficultyChart";
import { DurationByCategoryChart } from "./DurationByCategoryChart";
import { ActivityChart } from "./ActivityChart";
import { mergeActivitySeries } from "../../utils/statistics";
import { cn } from "@/lib/utils";

// note about date scope
const SectionHeader = ({ title, scope, hint }) => {
	const period = scope === "period";
	return (
		<div className="mt-1 flex items-baseline gap-2">
			<span
				className={cn(
					"size-2 shrink-0 rounded-full",
					period ? "bg-primary" : "bg-muted-foreground/50",
				)}
			/>
			<h2 className="text-sm font-semibold text-foreground">{title}</h2>
			{hint && <span className="text-xs text-muted-foreground">· {hint}</span>}
		</div>
	);
};

// data: { projects, tasks, timeline }; periodFilters: date-range controls element
const StatisticsDashboard = ({ data, periodFilters }) => {
	const timeline = data.timeline;
	const granularity = timeline?.granularity ?? "week";

	const projectRows = timeline
		? mergeActivitySeries(timeline.projects?.started, timeline.projects?.completed)
		: [];
	const taskRows = timeline
		? mergeActivitySeries(timeline.tasks?.started, timeline.tasks?.completed)
		: [];

	return (
		<div className="flex flex-col gap-4">
			{/* ALL-TIME: snapshots of the whole portfolio, ignore the date range */}
			<SectionHeader title="All-time" scope="all" hint="ignores the date range" />
			<SummaryCards stats={data} scope="all" />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<StatusPieChart data={data.projects?.byStatus ?? []} />
				<SuccessRateChart data={data.projects?.successRate} />
				<CategoryChart data={data.projects?.byCategory ?? []} />
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<DifficultyChart data={data.projects?.byDifficulty ?? []} />
				<DurationByCategoryChart data={data.projects?.durationByCategory ?? []} />
			</div>

			{/* SELECTED PERIOD: everything below reacts to the date controls */}
			<SectionHeader title="Selected period" scope="period" hint="set the date range below" />
			{periodFilters}
			<SummaryCards stats={data} scope="period" />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<ActivityChart
					title="Projects — started vs completed"
					data={projectRows}
					granularity={granularity}
				/>
				<ActivityChart
					title="Tasks — started vs completed"
					data={taskRows}
					granularity={granularity}
				/>
			</div>
		</div>
	);
};

export { StatisticsDashboard };
