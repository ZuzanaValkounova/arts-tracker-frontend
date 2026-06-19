import { useCallback, useEffect, useState } from "react";
import { Stage, Layer } from "react-konva";

import { ImageElement } from "./ImageElement";
import { TextElement } from "./TextElement";
import { ColorElement } from "./ColorElement";
import { DrawingElement } from "./DrawingElement";
import { ElementTransformer } from "./ElementTransformer";
import { DrawingLayer } from "./DrawingLayer";

const ELEMENT_COMPONENTS = {
	image: ImageElement,
	text: TextElement,
	color: ColorElement,
	drawing: DrawingElement,
};

const STAGE_WIDTH = 1000;
const STAGE_HEIGHT = 600;

const nextZ = (elements) => Math.max(0, ...elements.map((el) => el.z ?? 0)) + 1;

const MoodboardCanvas = ({
	elements,
	activeTool,
	activeColor = "#3b82f6",
	onElementAdd,
	onElementChange,
	onElementDelete,
}) => {
	const [selected, setSelected] = useState(null); // { id, node }
	const [editing, setEditing] = useState(null); // { id, content, x, y, width, fontSize, fontFamily, color }

	const handleStageClick = (e) => {
		const clickedOnEmpty = e.target === e.target.getStage();

		if (activeTool === "select" || activeTool === "draw") {
			if (clickedOnEmpty) setSelected(null);
			return;
		}

		if (!clickedOnEmpty) return;
		const pos = e.target.getStage().getPointerPosition();
		const base = { x: pos.x, y: pos.y, z: nextZ(elements), rotation: 0 };

		if (activeTool === "text") {
			onElementAdd({
				type: "text",
				...base,
				width: 200,
				height: 30,
				content: "Double-click to edit",
				fontSize: 20,
				fontFamily: "Arial",
				color: activeColor,
			});
		} else if (activeTool === "color") {
			onElementAdd({ type: "color", ...base, width: 80, height: 80, hex: activeColor });
		} else if (activeTool === "image") {
			onElementAdd({ type: "image", ...base, width: 200, height: 200 });
		}
	};

	const handleDrawEnd = useCallback(
		(pathData, bbox) => {
			onElementAdd({ type: "drawing", ...bbox, z: nextZ(elements), rotation: 0, pathData });
		},
		[onElementAdd, elements],
	);

	const handleStartEdit = (element) => {
		setSelected(null);
		setEditing({
			id: element._id,
			content: element.content,
			x: element.x,
			y: element.y,
			width: element.width || 200,
			fontSize: element.fontSize,
			fontFamily: element.fontFamily,
			color: element.color,
		});
	};

	const commitEdit = () => {
		if (!editing) return;
		const content = editing.content.trim();
		const original = elements.find((el) => el._id === editing.id)?.content;
		if (content && content !== original) {
			onElementChange(editing.id, { content });
		}
		setEditing(null);
	};

	const activeSelection =
		selected && elements.some((el) => el._id === selected.id) ? selected : null;

	useEffect(() => {
		const handleKey = (e) => {
			if ((e.key === "Delete" || e.key === "Backspace") && activeSelection) {
				onElementDelete(activeSelection.id);
				setSelected(null);
			}
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [activeSelection, onElementDelete]);

	const sortedElements = [...elements].sort((a, b) => (a.z ?? 0) - (b.z ?? 0));

	return (
		<div className="relative overflow-auto rounded-lg border border-gray-200 bg-white">
			<Stage
				width={STAGE_WIDTH}
				height={STAGE_HEIGHT}
				onClick={handleStageClick}
				onTap={handleStageClick}>
				<Layer>
					{sortedElements.map((element) => {
						const ElementComponent = ELEMENT_COMPONENTS[element.type];
						if (!ElementComponent) return null;
						return (
							<ElementComponent
								key={element._id}
								element={element}
								isSelected={activeSelection?.id === element._id}
								isEditing={editing?.id === element._id}
								onSelect={(e) =>
									activeTool === "select" && setSelected({ id: element._id, node: e.target })
								}
								onChange={(patch) => onElementChange(element._id, patch)}
								onStartEdit={() => handleStartEdit(element)}
							/>
						);
					})}
					{activeSelection && activeTool === "select" && (
						<ElementTransformer
							node={activeSelection.node}
							onTransform={(patch) => onElementChange(activeSelection.id, patch)}
						/>
					)}
				</Layer>
				<DrawingLayer
					tool={activeTool}
					color={activeColor}
					strokeWidth={2}
					onDrawEnd={handleDrawEnd}
				/>
			</Stage>

			{editing && (
				<textarea
					autoFocus
					value={editing.content}
					onChange={(e) => setEditing((prev) => ({ ...prev, content: e.target.value }))}
					onBlur={commitEdit}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							commitEdit();
						} else if (e.key === "Escape") {
							setEditing(null);
						}
					}}
					style={{
						position: "absolute",
						left: editing.x,
						top: editing.y,
						width: editing.width,
						fontSize: editing.fontSize,
						fontFamily: editing.fontFamily,
						color: editing.color,
						lineHeight: 1.1,
						padding: 0,
						margin: 0,
						border: "1px solid #3b82f6",
						outline: "none",
						background: "white",
						resize: "none",
						overflow: "hidden",
					}}
				/>
			)}
		</div>
	);
};

export { MoodboardCanvas };
