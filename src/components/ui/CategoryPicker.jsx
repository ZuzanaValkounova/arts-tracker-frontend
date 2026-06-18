// value: categoryId | null, options: [{ _id, name, icon }] from GET /api/categories
const CategoryPicker = ({ value, options = [], onChange, allowEmpty = true }) => {
	return (
		<select
			value={value ?? ""}
			onChange={(e) => onChange(e.target.value || null)}
			className="rounded border border-gray-300 px-2 py-1.5 text-sm"
		>
			{allowEmpty && <option value="">No category</option>}
			{options.map((category) => (
				<option key={category._id} value={category._id}>
					{category.name}
				</option>
			))}
		</select>
	);
};

export { CategoryPicker };
