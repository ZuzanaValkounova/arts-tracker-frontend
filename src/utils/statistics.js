const formatPeriodLabel = (periodStart, granularity) => {
	const date = new Date(periodStart);
	const options =
		granularity === "month"
			? { month: "short", year: "numeric" }
			: { day: "numeric", month: "short" };
	return date.toLocaleDateString(undefined, { ...options, timeZone: "UTC" });
};

// started + completed into chart rows
const mergeActivitySeries = (started = [], completed = []) =>
	started.map((point, index) => ({
		periodStart: point.periodStart,
		started: point.count,
		completed: completed[index]?.count ?? 0,
	}));

export { formatPeriodLabel, mergeActivitySeries };
