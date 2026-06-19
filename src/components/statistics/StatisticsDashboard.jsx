import { SummaryCards } from "./SummaryCards";
import { StatusPieChart } from "./StatusPieChart";
import { SuccessRateChart } from "./SuccessRateChart";
import { CategoryChart } from "./CategoryChart";
import { DifficultyChart } from "./DifficultyChart";
import { TagChart } from "./TagChart";
import { ActivityChart } from "./ActivityChart";
import { mergeActivitySeries } from "../../utils/statistics";

// data: { projects, tasks, timeline }
const StatisticsDashboard = ({ data }) => {
	const timeline = data.timeline;
	const granularity = timeline?.granularity ?? "week";

	const projectRows = timeline
		? mergeActivitySeries(timeline.projects?.created, timeline.projects?.completed)
		: [];
	const taskRows = timeline
		? mergeActivitySeries(timeline.tasks?.created, timeline.tasks?.completed)
		: [];

	return (
		<div className="flex flex-col gap-4">
			<SummaryCards stats={data} />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<StatusPieChart data={data.projects?.byStatus ?? []} />
				<SuccessRateChart data={data.projects?.successRate} />
				<CategoryChart data={data.projects?.byCategory ?? []} />
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<DifficultyChart data={data.projects?.byDifficulty ?? []} />
				<TagChart data={data.projects?.byTag ?? []} />
			</div>

			<h2 className="text-sm font-semibold text-gray-700">Activity over time</h2>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<ActivityChart
					title="Projects — created vs completed"
					data={projectRows}
					granularity={granularity}
				/>
				<ActivityChart
					title="Tasks — created vs completed"
					data={taskRows}
					granularity={granularity}
				/>
			</div>
		</div>
	);
};

export { StatisticsDashboard };
