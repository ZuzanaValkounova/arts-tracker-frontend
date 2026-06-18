// data: byCategory [{ _id, count, name, icon }]
const CategoryChart = ({ data }) => {
	const max = Math.max(1, ...data.map(({ count }) => count));

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-4">
			<h3 className="mb-3 text-sm font-semibold">Projects by category</h3>
			{data.length === 0 ? (
				<p className="text-sm text-gray-400">No data</p>
			) : (
				<div className="flex flex-col gap-2">
					{data.map(({ _id, count, name, icon }) => (
						<div key={_id ?? "none"} className="flex items-center gap-2 text-xs">
							<span className="w-28 truncate">
								{icon} {name ?? "No category"}
							</span>
							<div className="h-4 flex-1 rounded bg-gray-100">
								<div
									className="h-full rounded bg-blue-500"
									style={{ width: `${(count / max) * 100}%` }}
								/>
							</div>
							<span className="w-6 text-right text-gray-500">{count}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export { CategoryChart };
