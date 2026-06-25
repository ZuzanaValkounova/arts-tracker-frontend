import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { CategoryPicker } from "../ui/shared/CategoryPicker";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

//  filters: { search, status: wishlist|owned, categoryId }
const InventoryFilters = ({ filters, onChange, categories = [] }) => {
	const set = (patch) => onChange({ ...filters, ...patch });

	const [searchInput, setSearchInput] = useState(filters.search ?? "");
	const debouncedSearch = useDebouncedValue(searchInput, 300);

	useEffect(() => {
		if (debouncedSearch !== (filters.search ?? "")) {
			onChange({ ...filters, search: debouncedSearch });
		}
	}, [debouncedSearch]);

	return (
		<div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
			<div className="relative w-56">
				<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="search"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					placeholder="Search inventory…"
					className="pl-8"
				/>
			</div>
			<Select
				value={filters.status || "all"}
				onValueChange={(next) => set({ status: next === "all" ? null : next })}>
				<SelectTrigger className="w-44">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={"all"}>Owned + wishlist</SelectItem>
					<SelectItem value="owned">Owned</SelectItem>
					<SelectItem value="wishlist">Wishlist</SelectItem>
				</SelectContent>
			</Select>
			<CategoryPicker
				value={filters.categoryId ?? null}
				options={categories}
				onChange={(id) => set({ categoryId: id })}
			/>
		</div>
	);
};

export { InventoryFilters };
