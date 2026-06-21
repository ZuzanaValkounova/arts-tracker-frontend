import { Rect } from "react-konva";

// element: { _id, type: "color", x, y, z, width, height, rotation, hex }
// single-click selects/moves; double-click opens the recolor picker
const ColorElement = ({ element, isSelected, onSelect, onChange, onStartEdit }) => {
	return (
		<Rect
			x={element.x}
			y={element.y}
			width={element.width}
			height={element.height}
			rotation={element.rotation}
			fill={element.hex}
			cornerRadius={4}
			draggable
			onClick={onSelect}
			onTap={onSelect}
			onDblClick={onStartEdit}
			onDblTap={onStartEdit}
			onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
			stroke={isSelected ? "#3b82f6" : undefined}
			strokeWidth={isSelected ? 1 : 0}
		/>
	);
};

export { ColorElement };
