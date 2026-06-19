import { Text } from "react-konva";

// element: { _id, type: "text", x, y, z, width, height, rotation, content, fontSize, fontFamily, color }
const TextElement = ({ element, isSelected, isEditing, onSelect, onChange, onStartEdit }) => {
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
			visible={!isEditing}
			onClick={onSelect}
			onTap={onSelect}
			onDblClick={onStartEdit}
			onDblTap={onStartEdit}
			onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
			opacity={isSelected ? 0.9 : 1}
		/>
	);
};

export { TextElement };
