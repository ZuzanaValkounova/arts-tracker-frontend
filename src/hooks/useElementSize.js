import { useState, useEffect, useRef } from "react";

// tracks element's content-box size [ref, { width, height }]
const useElementSize = () => {
	const ref = useRef(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry) {
				setSize({
					width: Math.round(entry.contentRect.width),
					height: Math.round(entry.contentRect.height),
				});
			}
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return [ref, size];
};

export { useElementSize };
