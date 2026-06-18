import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";

// resize/rotate handles attached to the selected Konva node; converts the Konva
// scale back into width/height so the backend stores real dimensions
const ElementTransformer = ({ node, onTransform }) => {
	const transformerRef = useRef(null);

	useEffect(() => {
		const transformer = transformerRef.current;
		if (!transformer) return;
		transformer.nodes(node ? [node] : []);
		transformer.getLayer()?.batchDraw();
	}, [node]);

	const handleTransformEnd = () => {
		if (!node) return;
		const scaleX = node.scaleX();
		const scaleY = node.scaleY();
		node.scaleX(1);
		node.scaleY(1);
		onTransform({
			x: node.x(),
			y: node.y(),
			width: Math.max(5, node.width() * scaleX),
			height: Math.max(5, node.height() * scaleY),
			rotation: node.rotation(),
		});
	};

	return (
		<Transformer
			ref={transformerRef}
			rotateEnabled
			flipEnabled={false}
			onTransformEnd={handleTransformEnd}
			boundBoxFunc={(oldBox, newBox) => (newBox.width < 5 || newBox.height < 5 ? oldBox : newBox)}
		/>
	);
};

export { ElementTransformer };
