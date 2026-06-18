import { useEffect, useRef, useState } from "react";
import { Layer, Line } from "react-konva";

// freehand drawing: listens on the stage while tool === "draw", renders the live stroke
// and emits onDrawEnd(pathData, bbox) where pathData coordinates are relative to bbox
// (so the resulting element can be moved/transformed via its own x/y)
const DrawingLayer = ({ tool, color = "#1f2937", strokeWidth = 2, onDrawEnd }) => {
	const layerRef = useRef(null);
	const drawingRef = useRef(false);
	const [points, setPoints] = useState([]);

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
				if (current.length >= 4) {
					// bounding box of the stroke
					const xs = current.filter((_, i) => i % 2 === 0);
					const ys = current.filter((_, i) => i % 2 === 1);
					const minX = Math.min(...xs);
					const minY = Math.min(...ys);
					const bbox = {
						x: minX,
						y: minY,
						width: Math.max(1, Math.max(...xs) - minX),
						height: Math.max(1, Math.max(...ys) - minY),
					};
					// SVG path relative to the bbox origin
					const pathData = xs
						.map((x, i) => `${i === 0 ? "M" : "L"} ${x - minX} ${ys[i] - minY}`)
						.join(" ");
					onDrawEnd(pathData, bbox);
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

	return (
		<Layer ref={layerRef}>
			{points.length >= 4 && (
				<Line
					points={points}
					stroke={color}
					strokeWidth={strokeWidth}
					lineCap="round"
					lineJoin="round"
				/>
			)}
		</Layer>
	);
};

export { DrawingLayer };
