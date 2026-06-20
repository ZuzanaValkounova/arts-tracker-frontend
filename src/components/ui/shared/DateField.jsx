// value: ISO string | null; emits "yyyy-MM-dd" (accepted by the backend's Joi.date().iso()) or null
const DateField = ({ value, onChange, min, max, label }) => {
	const dateValue = value ? value.slice(0, 10) : "";

	return (
		<label className="flex flex-col gap-1 text-sm">
			{label && <span className="text-xs font-medium text-gray-600">{label}</span>}
			<input
				type="date"
				value={dateValue}
				min={min ? min.slice(0, 10) : undefined}
				max={max ? max.slice(0, 10) : undefined}
				onChange={(e) => onChange(e.target.value || null)}
				className="rounded border border-gray-300 px-2 py-1.5 text-sm"
			/>
		</label>
	);
};

export { DateField };
