import { Path } from "react-konva";

// element: { _id, type: "drawing", x, y, z, width, height, rotation, pathData }
// pathData is SVG path string ("M 0 0 L 10 12") with coordinates relative to x/y
const DrawingElement = ({ element, isSelected, onSelect, onChange }) => {
	return (
		<Path
			data={element.pathData}
			x={element.x}
			y={element.y}
			rotation={element.rotation}
			stroke={element.stroke ?? "#1f2937"}
			strokeWidth={2}
			lineCap="round"
			lineJoin="round"
			draggable
			onClick={onSelect}
			onTap={onSelect}
			onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
			opacity={isSelected ? 0.8 : 1}
		/>
	);
};

export { DrawingElement };
