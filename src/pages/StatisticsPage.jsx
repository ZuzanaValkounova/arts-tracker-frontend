import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { StatsFilters } from "../components/statistics/StatsFilters";
import { StatisticsDashboard } from "../components/statistics/StatisticsDashboard";
import { LoadingState } from "../components/ui/shared/LoadingState";
import { ErrorState } from "../components/ui/shared/ErrorState";

import { getProjectStatistics, getTaskStatistics, getTimelineStatistics } from "../api/statistics";
import { getCategories } from "../api/categories";
import { getProjects } from "../api/projects";
import { useAuth } from "../contexts/useAuth";

const iso = (date) => date.toISOString().slice(0, 10);

// default period: last 90 days
const defaultFilters = () => {
	const to = new Date();
	const from = new Date();
	from.setDate(to.getDate() - 90);
	return { from: iso(from), to: iso(to), granularity: "" };
};

const StatisticsPage = () => {
	const [token] = useAuth();
	const [filters, setFilters] = useState(defaultFilters);

	const common = { from: filters.from, to: filters.to };

	const projectStatsQuery = useQuery({
		queryKey: ["statistics", "projects", filters],
		queryFn: () =>
			getProjectStatistics(token, { ...common, categoryId: filters.categoryId ?? undefined }),
		placeholderData: keepPreviousData,
	});
	const taskStatsQuery = useQuery({
		queryKey: ["statistics", "tasks", filters],
		queryFn: () =>
			getTaskStatistics(token, {
				...common,
				projectId: filters.projectId ?? undefined,
				taskType: filters.taskType ?? undefined,
			}),
		placeholderData: keepPreviousData,
	});
	const timelineQuery = useQuery({
		queryKey: ["statistics", "timeline", filters],
		queryFn: () =>
			getTimelineStatistics(token, {
				...common,
				granularity: filters.granularity || undefined,
				categoryId: filters.categoryId ?? undefined,
				projectId: filters.projectId ?? undefined,
				taskType: filters.taskType ?? undefined,
			}),
		placeholderData: keepPreviousData,
	});
	const categoriesQuery = useQuery({
		queryKey: ["categories"],
		queryFn: () => getCategories(token),
	});
	const projectsQuery = useQuery({ queryKey: ["projects"], queryFn: () => getProjects(token) });

	const isLoading =
		projectStatsQuery.isLoading || taskStatsQuery.isLoading || timelineQuery.isLoading;
	const firstError = [projectStatsQuery, taskStatsQuery, timelineQuery].find((q) => q.isError);

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-xl font-bold">Statistics</h1>

			<StatsFilters
				filters={filters}
				onChange={setFilters}
				categories={categoriesQuery.data ?? []}
				projects={projectsQuery.data ?? []}
			/>

			{isLoading ? (
				<LoadingState />
			) : firstError ? (
				<ErrorState message={firstError.error.message} onRetry={firstError.refetch} />
			) : (
				<StatisticsDashboard
					data={{
						projects: projectStatsQuery.data,
						tasks: taskStatsQuery.data,
						timeline: timelineQuery.data,
					}}
				/>
			)}
		</div>
	);
};

export { StatisticsPage };
