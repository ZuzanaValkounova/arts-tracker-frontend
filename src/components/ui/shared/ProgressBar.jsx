// either pass value (0–100) directly, or completed + total and the percent is derived
const ProgressBar = ({ value, completed, total, showLabel = false }) => {
	const percent =
		value ?? (total > 0 ? Math.round((completed / total) * 100) : 0);

	return (
		<div className="flex items-center gap-2">
			<div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
				<div
					className="h-full rounded-full bg-green-500 transition-all"
					style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
				/>
			</div>
			{showLabel && (
				<span className="shrink-0 text-xs text-gray-500">
					{total != null ? `${completed}/${total} · ` : ""}
					{percent} %
				</span>
			)}
		</div>
	);
};

export { ProgressBar };
