// perfect-freehand helpers for moodboard draw tool
const DRAWING_INK = "#1f2937";

const STROKE_OPTIONS = {
	size: 8,
	thinning: 0.6,
	smoothing: 0.5,
	streamline: 0.5,
};

const average = (a, b) => (a + b) / 2;

// perfect-freehand outline points -> closed, smoothed SVG path (filled stroke)
const getSvgPathFromStroke = (points) => {
	if (!points.length) return "";
	const first = points[0];
	let result = `M ${first[0].toFixed(2)} ${first[1].toFixed(2)} Q`;
	for (let i = 0; i < points.length; i++) {
		const [x0, y0] = points[i];
		const [x1, y1] = points[(i + 1) % points.length];
		result += ` ${x0.toFixed(2)} ${y0.toFixed(2)} ${average(x0, x1).toFixed(2)} ${average(y0, y1).toFixed(2)}`;
	}
	result += " Z";
	return result;
};

export { DRAWING_INK, STROKE_OPTIONS, getSvgPathFromStroke };
