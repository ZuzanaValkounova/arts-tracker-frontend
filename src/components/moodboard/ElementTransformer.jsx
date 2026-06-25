import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";

// resize/rotate handles attached to the selected Konva node; converts the Konva
// scale back into width/height so the backend stores real dimensions
const ElementTransformer = ({ node, resizeEnabled = true, onTransform }) => {
	const transformerRef = useRef(null);

	useEffect(() => {
		const transformer = transformerRef.current;
		if (!transformer) return;
		transformer.nodes(node ? [node] : []);
		transformer.getLayer()?.batchDraw();
	}, [node]);

	const handleTransformEnd = () => {
		if (!node) return;
		const newWidth = Math.max(5, node.width() * node.scaleX());
		const newHeight = Math.max(5, node.height() * node.scaleY());
		node.scaleX(1);
		node.scaleY(1);
		node.width(newWidth);
		node.height(newHeight);
		onTransform({
			x: node.x(),
			y: node.y(),
			width: newWidth,
			height: newHeight,
			rotation: node.rotation(),
		});
	};

	return (
		<Transformer
			ref={transformerRef}
			resizeEnabled={resizeEnabled}
			flipEnabled={false}
			onTransformEnd={handleTransformEnd}
			boundBoxFunc={(oldBox, newBox) => (newBox.width < 5 || newBox.height < 5 ? oldBox : newBox)}
		/>
	);
};

export { ElementTransformer };
