import { Path } from "react-konva";

import { DRAWING_INK } from "../../utils/moodboard";

// element: { _id, type: "drawing", x, y, z, width, height, rotation, pathData, color }
// pathData is a closed perfect-freehand outline (filled), coordinates relative to x/y
const DrawingElement = ({ element, draggable = true, onSelect, onChange }) => {
	return (
		<Path
			data={element.pathData}
			x={element.x}
			y={element.y}
			rotation={element.rotation}
			fill={element.color ?? DRAWING_INK}
			draggable={draggable}
			onClick={onSelect}
			onTap={onSelect}
			onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
		/>
	);
};

export { DrawingElement };
