import { Draggable } from "@hello-pangea/dnd";

import { TaskCard } from "./TaskCard";

const SortableTaskCard = ({ task, index, onOpen }) => {
	return (
		<Draggable draggableId={task._id} index={index}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					style={{
						...provided.draggableProps.style,
						opacity: snapshot.isDragging ? 0.85 : 1,
					}}>
					<TaskCard task={task} onOpen={onOpen} />
				</div>
			)}
		</Draggable>
	);
};

export { SortableTaskCard };
