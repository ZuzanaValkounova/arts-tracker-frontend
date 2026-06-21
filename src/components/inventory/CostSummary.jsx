// totals: { estimated, actual }
const CostSummary = ({ totals, currency = "CZK" }) => {
	return (
		<div className="flex gap-4">
			<div className="flex-1 rounded-lg bg-muted p-3">
				<div className="text-xs text-muted-foreground">Estimated cost</div>
				<div className="text-lg font-semibold">
					{totals.estimated.toLocaleString()} {currency}
				</div>
			</div>
			<div className="flex-1 rounded-lg bg-muted p-3">
				<div className="text-xs text-muted-foreground">Actual cost</div>
				<div className="text-lg font-semibold">
					{totals.actual.toLocaleString()} {currency}
				</div>
			</div>
		</div>
	);
};

export { CostSummary };
