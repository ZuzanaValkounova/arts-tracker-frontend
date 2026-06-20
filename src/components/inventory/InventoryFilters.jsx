import { CategoryPicker } from "../ui/shared/CategoryPicker";

//  filters: { search, status: wishlist|owned, categoryId }
const InventoryFilters = ({ filters, onChange, categories = [] }) => {
	const set = (patch) => onChange({ ...filters, ...patch });

	return (
		<div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
			<input
				type="search"
				value={filters.search ?? ""}
				onChange={(e) => set({ search: e.target.value })}
				placeholder="Search inventory…"
				className="w-56 rounded border border-gray-300 px-2 py-1.5 text-sm"
			/>
			<select
				value={filters.status ?? ""}
				onChange={(e) => set({ status: e.target.value || null })}
				className="rounded border border-gray-300 px-2 py-1.5 text-sm">
				<option value="">Owned + wishlist</option>
				<option value="owned">Owned</option>
				<option value="wishlist">Wishlist</option>
			</select>
			<CategoryPicker
				value={filters.categoryId ?? null}
				options={categories}
				onChange={(id) => set({ categoryId: id })}
			/>
		</div>
	);
};

export { InventoryFilters };
