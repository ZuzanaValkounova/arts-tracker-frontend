import { Text } from "react-konva";

// element: { _id, type: "text", x, y, z, width, height, rotation, content, fontSize, fontFamily, color }
// TODO: double-click inline editing (overlay a textarea above the stage, then PATCH content)
const TextElement = ({ element, isSelected, onSelect, onChange }) => {
	return (
		<Text
			text={element.content}
			x={element.x}
			y={element.y}
			width={element.width}
			rotation={element.rotation}
			fontSize={element.fontSize}
			fontFamily={element.fontFamily}
			fill={element.color}
			draggable
			onClick={onSelect}
			onTap={onSelect}
			onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
			opacity={isSelected ? 0.9 : 1}
		/>
	);
};

export { TextElement };
