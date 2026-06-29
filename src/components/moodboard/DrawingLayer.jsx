import { useEffect, useRef, useState } from "react";
import { Layer, Path } from "react-konva";
import { getStroke } from "perfect-freehand";

import { DRAWING_INK, STROKE_OPTIONS, getSvgPathFromStroke } from "../../utils/moodboard";

// drawing via perfect-freehand
const DrawingLayer = ({ tool, color = DRAWING_INK, onDrawEnd }) => {
	const layerRef = useRef(null);
	const drawingRef = useRef(false);
	const pointsRef = useRef([]); // [[x, y]]
	const clearFrameRef = useRef(0); // clears the live preview one frame after a stroke ends
	const [points, setPoints] = useState([]); // mirror to re-render the live preview

	useEffect(() => {
		const stage = layerRef.current?.getStage();
		if (!stage || tool !== "draw") return;

		// use the layer-relative position so strokes land in board coordinates even after stage panning
		const getPos = () =>
			layerRef.current?.getRelativePointerPosition() ?? stage.getPointerPosition();

		const handleDown = () => {
			const pointer = getPos();
			if (!pointer) return;
			cancelAnimationFrame(clearFrameRef.current);
			drawingRef.current = true;
			pointsRef.current = [[pointer.x, pointer.y]];
			setPoints(pointsRef.current);
		};
		const handleMove = () => {
			if (!drawingRef.current) return;
			const pointer = getPos();
			if (!pointer) return;
			pointsRef.current = [...pointsRef.current, [pointer.x, pointer.y]];
			setPoints(pointsRef.current);
		};
		const handleUp = () => {
			if (!drawingRef.current) return;
			drawingRef.current = false;
			const current = pointsRef.current;
			pointsRef.current = [];
			if (current.length < 2) {
				setPoints([]);
				return;
			}

			const outline = getStroke(current, STROKE_OPTIONS);
			if (!outline.length) {
				setPoints([]);
				return;
			}
			const xs = outline.map((point) => point[0]);
			const ys = outline.map((point) => point[1]);
			const minX = Math.floor(Math.min(...xs));
			const minY = Math.floor(Math.min(...ys));
			const bbox = {
				x: minX,
				y: minY,
				width: Math.max(1, Math.ceil(Math.max(...xs)) - minX),
				height: Math.max(1, Math.ceil(Math.max(...ys)) - minY),
			};
			const pathData = getSvgPathFromStroke(
				outline.map((point) => [point[0] - minX, point[1] - minY]),
			);
			if (!pathData) {
				setPoints([]);
				return;
			}

			onDrawEnd(pathData, bbox);
			// Hold the finished stroke on screen for one more frame
			clearFrameRef.current = requestAnimationFrame(() => setPoints([]));
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
