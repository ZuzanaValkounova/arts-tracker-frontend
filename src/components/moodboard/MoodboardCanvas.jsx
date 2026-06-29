import { useCallback, useEffect, useState } from "react";
import { Stage, Layer } from "react-konva";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";

import { ImageElement } from "./ImageElement";
import { TextElement } from "./TextElement";
import { ColorElement } from "./ColorElement";
import { DrawingElement } from "./DrawingElement";
import { ElementTransformer } from "./ElementTransformer";
import { DrawingLayer } from "./DrawingLayer";
import { useElementSize } from "../../hooks/useElementSize";
import { ColorPicker } from "../ui/shared/ColorPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const ELEMENT_COMPONENTS = {
	image: ImageElement,
	text: TextElement,
	color: ColorElement,
	drawing: DrawingElement,
};

const FONT_OPTIONS = [
	{ value: "sans-serif", label: "Sans" },
	{ value: "serif", label: "Serif" },
	{ value: "monospace", label: "Mono" },
	{ value: "cursive", label: "Handwriting" },
	{ value: "Georgia", label: "Georgia" },
];

const DOT_GRID = {
	backgroundImage: "radial-gradient(circle, var(--border) 1.25px, transparent 1.25px)",
	backgroundSize: "22px 22px",
};

const nextZ = (elements) => Math.max(0, ...elements.map((element) => element.z ?? 0)) + 1;

const MoodboardCanvas = ({
	elements,
	activeTool,
	activeColor = "#3b82f6",
	onElementAdd,
	onElementChange,
	onElementDelete,
}) => {
	const [containerRef, { width, height }] = useElementSize();
	const [selected, setSelected] = useState(null); // { id, node }
	const [editing, setEditing] = useState(null); // text-content editing overlay
	// the board is one fixed space; the stage a window into it that the user pans around
	const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
	const isPanned = stagePos.x !== 0 || stagePos.y !== 0;

	const ready = width > 0 && height > 0;

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
				fontFamily: "sans-serif",
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
			onElementAdd({
				type: "drawing",
				...bbox,
				z: nextZ(elements),
				rotation: 0,
				pathData,
				color: activeColor,
			});
		},
		[onElementAdd, elements, activeColor],
	);

	const handleStartTextEdit = (element) => {
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
		const original = elements.find((element) => element._id === editing.id)?.content;
		if (content && content !== original) {
			onElementChange(editing.id, { content });
		}
		setEditing(null);
	};

	const activeSelection =
		selected && elements.some((element) => element._id === selected.id) ? selected : null;
	const selectedElement = activeSelection
		? elements.find((element) => element._id === activeSelection.id)
		: null;

	const bringToFront = () => {
		const maxZ = Math.max(0, ...elements.map((element) => element.z ?? 0));
		onElementChange(selectedElement._id, { z: maxZ + 1 });
	};
	const sendToBack = () => {
		const minZ = Math.min(0, ...elements.map((element) => element.z ?? 0));
		onElementChange(selectedElement._id, { z: minZ - 1 });
	};

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
		<div
			ref={containerRef}
			className={`relative h-full w-full overflow-hidden rounded-lg border bg-card ${
				activeTool === "select" ? "cursor-grab active:cursor-grabbing" : ""
			}`}
			style={DOT_GRID}>
			{/* floating controls for selected element: style, color, z-order, delete */}
			{selectedElement && (
				<div className="absolute top-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-lg border bg-popover p-1.5 shadow-md">
					{selectedElement.type === "text" && (
						<>
							<Select
								value={selectedElement.fontFamily}
								onValueChange={(fontFamily) =>
									onElementChange(selectedElement._id, { fontFamily })
								}>
								<SelectTrigger size="sm" className="w-28">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{FONT_OPTIONS.map((font) => (
										<SelectItem key={font.value} value={font.value}>
											{font.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Input
								type="number"
								min={8}
								max={200}
								value={selectedElement.fontSize}
								onChange={(e) =>
									onElementChange(selectedElement._id, { fontSize: Number(e.target.value) || 8 })
								}
								className="h-8 w-16"
							/>
						</>
					)}
					{selectedElement.type === "color" && (
						<ColorPicker
							value={selectedElement.hex}
							onChange={(color) => color && onElementChange(selectedElement._id, { hex: color })}
						/>
					)}
					{(selectedElement.type === "text" || selectedElement.type === "drawing") && (
						<ColorPicker
							value={selectedElement.color}
							onChange={(color) => color && onElementChange(selectedElement._id, { color })}
						/>
					)}
					{selectedElement.type !== "image" && <span className="mx-0.5 h-6 w-px bg-border" />}
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						title="Bring to front"
						onClick={bringToFront}>
						<BringToFront />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						title="Send to back"
						onClick={sendToBack}>
						<SendToBack />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						title="Delete"
						className="text-destructive hover:text-destructive"
						onClick={() => {
							onElementDelete(selectedElement._id);
							setSelected(null);
						}}>
						<Trash2 />
					</Button>
				</div>
			)}

			{/* recenter the view after panning away from the content */}
			{isPanned && (
				<Button
					type="button"
					variant="secondary"
					size="sm"
					className="absolute right-2 bottom-2 z-10 shadow-md"
					onClick={() => setStagePos({ x: 0, y: 0 })}>
					Reset view
				</Button>
			)}

			{ready && (
				<Stage
					width={width}
					height={height}
					x={stagePos.x}
					y={stagePos.y}
					draggable={activeTool === "select"}
					onClick={handleStageClick}
					onTap={handleStageClick}
					onDragEnd={(e) => {
						// only the stage panning should update the view
						if (e.target === e.target.getStage()) {
							setStagePos({ x: e.target.x(), y: e.target.y() });
						}
					}}>
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
									draggable={activeTool === "select"}
									onSelect={(e) =>
										activeTool === "select" && setSelected({ id: element._id, node: e.target })
									}
									onChange={(patch) => onElementChange(element._id, patch)}
									onStartEdit={() => element.type === "text" && handleStartTextEdit(element)}
								/>
							);
						})}
						{activeSelection && activeTool === "select" && (
							<ElementTransformer
								node={activeSelection.node}
								resizeEnabled={
									selectedElement?.type !== "text" && selectedElement?.type !== "drawing"
								}
								onTransform={(patch) => onElementChange(activeSelection.id, patch)}
							/>
						)}
					</Layer>
					<DrawingLayer tool={activeTool} color={activeColor} onDrawEnd={handleDrawEnd} />
				</Stage>
			)}

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
						left: editing.x + stagePos.x,
						top: editing.y + stagePos.y,
						width: editing.width,
						fontSize: editing.fontSize,
						fontFamily: editing.fontFamily,
						color: editing.color,
						lineHeight: 1.1,
						padding: 0,
						margin: 0,
						border: "1px solid var(--ring)",
						borderRadius: "4px",
						outline: "none",
						background: "var(--card)",
						boxShadow: "0 2px 10px rgb(0 0 0 / 0.35)",
						resize: "none",
						overflow: "hidden",
					}}
				/>
			)}
		</div>
	);
};

export { MoodboardCanvas };
