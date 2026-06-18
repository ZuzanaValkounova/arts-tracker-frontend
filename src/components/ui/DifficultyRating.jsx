// 1–5 stars
const DifficultyRating = ({ value = 0, onChange, readOnly = false }) => {
	return (
		<div className="inline-flex items-center gap-0.5" role={readOnly ? "img" : "radiogroup"}>
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					type="button"
					disabled={readOnly}
					onClick={() => onChange?.(star === value ? null : star)}
					className={`text-lg leading-none ${star <= value ? "text-amber-400" : "text-gray-300"} ${
						readOnly ? "cursor-default" : "cursor-pointer hover:text-amber-500"
					}`}
					aria-label={`Difficulty ${star} of 5`}>
					★
				</button>
			))}
		</div>
	);
};

export { DifficultyRating };
