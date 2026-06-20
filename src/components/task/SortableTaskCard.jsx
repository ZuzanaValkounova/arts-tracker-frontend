import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { TaskCard } from "./TaskCard";

// dnd-kit wrapper: registers the card as sortable under the task id
const SortableTaskCard = ({ task, onOpen }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: task._id,
		data: { type: "task", task },
	});

	return (
		<div
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			{...attributes}
			{...listeners}>
			<TaskCard task={task} onOpen={onOpen} dragging={isDragging} />
		</div>
	);
};

export { SortableTaskCard };
