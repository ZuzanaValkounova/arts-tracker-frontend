import { useEffect, useState } from "react";
import { Image as KonvaImage } from "react-konva";

// element: { _id, type: "image", x, y, z, width, height, rotation, url, publicId }
// draggable only in select mode
const ImageElement = ({ element, draggable = true, onSelect, onChange }) => {
	const [image, setImage] = useState(null);

	useEffect(() => {
		const img = new window.Image();
		img.crossOrigin = "anonymous";
		img.src = element.url;
		img.onload = () => setImage(img);
	}, [element.url]);

	return (
		<KonvaImage
			image={image}
			x={element.x}
			y={element.y}
			width={element.width}
			height={element.height}
			rotation={element.rotation}
			draggable={draggable}
			onClick={onSelect}
			onTap={onSelect}
			onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
		/>
	);
};

export { ImageElement };
