import { useState, useEffect } from "react";

// returns value after it has stopped changing for delay ms
const useDebouncedValue = (value, delay = 300) => {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const id = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(id);
	}, [value, delay]);

	return debounced;
};

export { useDebouncedValue };
