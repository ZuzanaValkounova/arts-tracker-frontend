import { SummaryCards } from "./SummaryCards";
import { StatusPieChart } from "./StatusPieChart";
import { SuccessRateChart } from "./SuccessRateChart";
import { CategoryChart } from "./CategoryChart";
import { PeriodChart } from "./PeriodChart";

// data: { projects, tasks, timeline } merged results of the three statistics endpoints
// TODO byDifficulty and byTag also available in data.projects
const StatisticsDashboard = ({ data }) => {
	return (
		<div className="flex flex-col gap-4">
			<SummaryCards stats={data} />
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<StatusPieChart data={data.projects?.byStatus ?? []} />
				<SuccessRateChart data={data.projects?.successRate} />
				<CategoryChart data={data.projects?.byCategory ?? []} />
			</div>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<PeriodChart
					data={data.timeline?.projects?.completed ?? []}
					title="Projects completed over time"
				/>
				<PeriodChart
					data={data.timeline?.tasks?.completed ?? []}
					title="Tasks completed over time"
				/>
			</div>
		</div>
	);
};

export { StatisticsDashboard };
