import { useSearchParams } from "react-router-dom";

// Reads/writes filter state in the URL query string, so filtered views are bookmarkable and
// survive navigation (e.g. opening a detail and coming back).
//  - get(key, fallback="")  → the param value (or fallback when absent)
//  - set(patch)             → merges a patch; "", null and [] remove the key. Arrays are
//                             comma-joined. Written with replace:true so typing in a search box
//                             doesn't flood the history stack.
const useUrlFilters = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const get = (key, fallback = "") => searchParams.get(key) ?? fallback;

	const set = (patch) =>
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				for (const [key, value] of Object.entries(patch)) {
					const isEmpty =
						value == null || value === "" || (Array.isArray(value) && value.length === 0);
					if (isEmpty) next.delete(key);
					else next.set(key, Array.isArray(value) ? value.join(",") : value);
				}
				return next;
			},
			{ replace: true },
		);

	return { get, set };
};

export { useUrlFilters };
