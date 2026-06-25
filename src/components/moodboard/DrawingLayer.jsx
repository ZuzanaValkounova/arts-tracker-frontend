import { useEffect, useRef, useState } from "react";
import { Layer, Path } from "react-konva";
import { getStroke } from "perfect-freehand";

import { DRAWING_INK, STROKE_OPTIONS, getSvgPathFromStroke } from "../../utils/moodboard";

// drawing via perfect-freehand
const DrawingLayer = ({ tool, color = DRAWING_INK, onDrawEnd }) => {
	const layerRef = useRef(null);
	const drawingRef = useRef(false);
	const pointsRef = useRef([]); // [[x, y]]
	const [points, setPoints] = useState([]); // mirror to re-render the live preview

	useEffect(() => {
		const stage = layerRef.current?.getStage();
		if (!stage || tool !== "draw") return;

		const getPos = () => stage.getPointerPosition();

		const handleDown = () => {
			const pos = getPos();
			if (!pos) return;
			drawingRef.current = true;
			pointsRef.current = [[pos.x, pos.y]];
			setPoints(pointsRef.current);
		};
		const handleMove = () => {
			if (!drawingRef.current) return;
			const pos = getPos();
			if (!pos) return;
			pointsRef.current = [...pointsRef.current, [pos.x, pos.y]];
			setPoints(pointsRef.current);
		};
		const handleUp = () => {
			if (!drawingRef.current) return;
			drawingRef.current = false;
			const current = pointsRef.current;
			pointsRef.current = [];
			setPoints([]);
			if (current.length < 2) return;

			const outline = getStroke(current, STROKE_OPTIONS);
			if (!outline.length) return;
			const xs = outline.map((p) => p[0]);
			const ys = outline.map((p) => p[1]);
			const minX = Math.floor(Math.min(...xs));
			const minY = Math.floor(Math.min(...ys));
			const bbox = {
				x: minX,
				y: minY,
				width: Math.max(1, Math.ceil(Math.max(...xs)) - minX),
				height: Math.max(1, Math.ceil(Math.max(...ys)) - minY),
			};
			const pathData = getSvgPathFromStroke(outline.map((p) => [p[0] - minX, p[1] - minY]));
			if (pathData) onDrawEnd(pathData, bbox);
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
