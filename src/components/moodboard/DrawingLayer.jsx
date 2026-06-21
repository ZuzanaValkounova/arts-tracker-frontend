import { useEffect, useRef, useState } from "react";
import { Layer, Path } from "react-konva";
import { getStroke } from "perfect-freehand";

import { DRAWING_INK, STROKE_OPTIONS, getSvgPathFromStroke } from "../../utils/moodboard";

// freehand drawing via perfect-freehand: listens on the stage while tool === "draw",
// renders the live filled stroke and emits onDrawEnd(pathData, bbox) where pathData is
// a closed outline relative to bbox
const DrawingLayer = ({ tool, color = DRAWING_INK, onDrawEnd }) => {
	const layerRef = useRef(null);
	const drawingRef = useRef(false);
	const [points, setPoints] = useState([]); // array of [x, y]

	useEffect(() => {
		const stage = layerRef.current?.getStage();
		if (!stage || tool !== "draw") return;

		const getPos = () => stage.getPointerPosition();

		const handleDown = () => {
			drawingRef.current = true;
			const pos = getPos();
			setPoints([pos.x, pos.y]);
		};
		const handleMove = () => {
			if (!drawingRef.current) return;
			const pos = getPos();
			setPoints((prev) => [...prev, pos.x, pos.y]);
		};
		const handleUp = () => {
			if (!drawingRef.current) return;
			drawingRef.current = false;
			setPoints((current) => {
				if (current.length >= 2) {
					const xs = current.map((pos) => pos[0]);
					const ys = current.map((pos) => pos[1]);
					const minX = Math.min(...xs);
					const minY = Math.min(...ys);
					const bbox = {
						x: minX,
						y: minY,
						width: Math.max(1, Math.max(...xs) - minX),
						height: Math.max(1, Math.max(...ys) - minY),
					};
					// build filled outline relative to bbox origin
					const relative = current.map((p) => [p[0] - minX, p[1] - minY]);
					const pathData = getSvgPathFromStroke(getStroke(relative, STROKE_OPTIONS));
					if (pathData) onDrawEnd(pathData, bbox);
				}
				return [];
			});
		};

		stage.on("mousedown.draw touchstart.draw", handleDown);
		stage.on("mousemove.draw touchmove.draw", handleMove);
		stage.on("mouseup.draw touchend.draw", handleUp);
		return () => {
			stage.off(".draw");
		};
	}, [tool, onDrawEnd]);

	const livePath =
		points.length >= 2 ? getSvgPathFromStroke(getStroke(points, STROKE_OPTIONS)) : "";

	return <Layer ref={layerRef}>{livePath && <Path data={livePath} fill={color} />}</Layer>;
};

export { DrawingLayer };
