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

// every element needs x, y, z, width, height, rotation.
// clicking the canvas with a creation tool emits onElementAdd with defaults:
//  - text  → default content/font, page may open an edit dialog afterwards
//  - color → tile in activeColor
//  - image → emits { type: "image", ...position } and the PAGE opens an upload dialog,
// drawing strokes are finished by DrawingLayer and emitted as complete elements
const MoodboardCanvas = ({
	elements,
	activeTool,
	activeColor = "#3b82f6",
	onElementAdd,
	onElementChange,
	onElementDelete,
}) => {
	// the selected element id together with its Konva node, captured from the click event
	// (refs must not be read during render, so the node travels through state instead)
	const [selected, setSelected] = useState(null); // { id, node }

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
			// page completes this with imageFile/imageUrl via an upload dialog
			onElementAdd({ type: "image", ...base, width: 200, height: 200 });
		}
	};

	const handleDrawEnd = useCallback(
		(pathData, bbox) => {
			onElementAdd({ type: "drawing", ...bbox, z: nextZ(elements), rotation: 0, pathData });
		},
		[onElementAdd, elements],
	);

	const activeSelection =
		selected && elements.some((el) => el._id === selected.id) ? selected : null;

	// Delete/Backspace removes the selected element
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
		<div className="overflow-auto rounded-lg border border-gray-200 bg-white">
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
								onSelect={(e) =>
									activeTool === "select" && setSelected({ id: element._id, node: e.target })
								}
								onChange={(patch) => onElementChange(element._id, patch)}
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
		</div>
	);
};

export { MoodboardCanvas };
