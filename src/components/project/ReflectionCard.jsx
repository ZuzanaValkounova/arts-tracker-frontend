const ReflectionCard = ({ reflection, onEdit }) => {
	if (!reflection) return null;

	const sections = [
		{ label: "What worked", value: reflection.whatWorked },
		{ label: "What didn't work", value: reflection.whatDidntWork },
		{ label: "What to improve", value: reflection.whatToImprove },
	];

	return (
		<section className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold">Reflection</h3>
				{onEdit && (
					<button
						type="button"
						onClick={onEdit}
						className="text-xs text-gray-500 hover:text-gray-800">
						Edit
					</button>
				)}
			</div>
			{sections.map(
				({ label, value }) =>
					value && (
						<div key={label}>
							<div className="text-xs font-medium text-gray-500">{label}</div>
							<p className="whitespace-pre-wrap text-sm text-gray-700">{value}</p>
						</div>
					),
			)}
		</section>
	);
};

export { ReflectionCard };
