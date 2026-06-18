// successRate is a single number (completed / non-archived projects, in %)
const SuccessRateChart = ({ data }) => {
	const rate = Math.round(data ?? 0);

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-4">
			<h3 className="mb-3 text-sm font-semibold">Success rate</h3>
			<div className="flex items-center justify-center">
				<div
					className="relative flex h-32 w-32 items-center justify-center rounded-full"
					style={{ background: `conic-gradient(#22c55e ${rate * 3.6}deg, #e5e7eb 0deg)` }}>
					<div className="absolute flex h-24 w-24 items-center justify-center rounded-full bg-white text-xl font-bold">
						{rate} %
					</div>
				</div>
			</div>
		</div>
	);
};

export { SuccessRateChart };
