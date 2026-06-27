import * as React from "react";

const MOBILE_BREAKPOINT = 768;

const mobileQuery = () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

export function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState(() => mobileQuery().matches);

	React.useEffect(() => {
		const mql = mobileQuery();
		const onChange = () => setIsMobile(mql.matches);
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return isMobile;
}
