import { Rect } from "react-konva";

// element: { _id, type: "color", x, y, z, width, height, rotation, hex }
const ColorElement = ({ element, isSelected, draggable = true, onSelect, onChange }) => {
	return (
		<Rect
			x={element.x}
			y={element.y}
			width={element.width}
			height={element.height}
			rotation={element.rotation}
			fill={element.hex}
			cornerRadius={4}
			draggable={draggable}
			onClick={onSelect}
			onTap={onSelect}
			onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
			stroke={isSelected ? "#3b82f6" : undefined}
			strokeWidth={isSelected ? 1 : 0}
		/>
	);
};

export { ColorElement };
