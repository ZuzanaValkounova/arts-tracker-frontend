const formatPeriodLabel = (periodStart, granularity) => {
	const date = new Date(periodStart);
	const options =
		granularity === "month"
			? { month: "short", year: "numeric" }
			: { day: "numeric", month: "short" };
	return date.toLocaleDateString(undefined, { ...options, timeZone: "UTC" });
};

// created + completed series into chart rows
const mergeActivitySeries = (created = [], completed = []) =>
	created.map((point, index) => ({
		periodStart: point.periodStart,
		created: point.count,
		completed: completed[index]?.count ?? 0,
	}));

export { formatPeriodLabel, mergeActivitySeries };
