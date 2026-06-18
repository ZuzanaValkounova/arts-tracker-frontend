// data: one timeline series [{ period: "2026-W23", count: 2 }]
// backend omits empty periods; fill them on the page by iterating from -> to
// (TODO: utils/statistics fillPeriods)
const PeriodChart = ({ data, title = "Activity over time" }) => {
	const max = Math.max(1, ...data.map(({ count }) => count));

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-4">
			<h3 className="mb-3 text-sm font-semibold">{title}</h3>
			{data.length === 0 ? (
				<p className="text-sm text-gray-400">No data</p>
			) : (
				<div className="flex h-32 items-end gap-1">
					{data.map(({ period, count }) => (
						<div
							key={period}
							className="flex flex-1 flex-col items-center gap-1"
							title={`${period}: ${count}`}>
							<div
								className="w-full rounded-t bg-blue-500"
								style={{ height: `${(count / max) * 100}%` }}
							/>
							<span className="origin-top-left -rotate-45 whitespace-nowrap text-[9px] text-gray-400">
								{period}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export { PeriodChart };
