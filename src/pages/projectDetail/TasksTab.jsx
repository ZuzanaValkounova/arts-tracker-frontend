import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { ViewSwitcher } from "../../components/ui/ViewSwitcher";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { LoadingState } from "../../components/ui/LoadingState";
import { ErrorState } from "../../components/ui/ErrorState";
import { TaskKanbanBoard } from "../../components/task/TaskKanbanBoard";
import { TaskListView } from "../../components/task/TaskListView";
import { TaskForm } from "../../components/task/TaskForm";
import { TaskDetailDialog } from "../../components/task/TaskDetailDialog";

import { getTasks, createTask, updateTask, deleteTask, renumberTasks } from "../../api/tasks";
import { useAuth } from "../../contexts/AuthContext";

const TasksTab = ({ project, onCascade }) => {
	const [token] = useAuth();
	const queryClient = useQueryClient();
	const projectId = project._id;

	const [view, setView] = useState("kanban");
	const [formOpen, setFormOpen] = useState(false);
	const [editedTask, setEditedTask] = useState(null);
	const [parentTask, setParentTask] = useState(null);
	const [openTaskId, setOpenTaskId] = useState(null);
	const [taskToDelete, setTaskToDelete] = useState(null);

	const tasksQuery = useQuery({
		queryKey: ["tasks", projectId],
		queryFn: () => getTasks(token, { projectId }),
	});
	const tasks = tasksQuery.data ?? [];

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["tasks"] });
	};

	const handleMutationResult = (result) => {
		invalidate();
		onCascade?.(result);
	};

	const saveMutation = useMutation({
		mutationFn: (values) =>
			editedTask ? updateTask(token, editedTask._id, values) : createTask(token, values),
		onSuccess: (result) => {
			handleMutationResult(result);
			closeForm();
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ taskId, values }) => updateTask(token, taskId, values),
		onSuccess: handleMutationResult,
	});

	const deleteMutation = useMutation({
		mutationFn: (taskId) => deleteTask(token, taskId),
		onSuccess: handleMutationResult,
	});

	const renumberMutation = useMutation({
		mutationFn: (parentTaskId) => renumberTasks(token, { projectId, parentTaskId }),
		onSuccess: invalidate,
	});

	const closeForm = () => {
		setFormOpen(false);
		setEditedTask(null);
		setParentTask(null);
	};

	const handleToggleComplete = (taskId) => {
		const task = tasks.find((t) => t._id === taskId);
		updateMutation.mutate({
			taskId,
			values: { status: task?.status === "completed" ? "planned" : "completed" },
		});
	};

	const openTask = openTaskId ? tasks.find((t) => t._id === openTaskId) : null;
	const openTaskSubtasks = openTask
		? tasks.filter((t) => {
				let current = t;
				while (current?.parentTaskId) {
					if (current.parentTaskId === openTask._id) return true;
					current = tasks.find((x) => x._id === current.parentTaskId);
				}
				return false;
			})
		: [];

	if (tasksQuery.isLoading) return <LoadingState />;
	if (tasksQuery.isError)
		return <ErrorState message={tasksQuery.error.message} onRetry={tasksQuery.refetch} />;

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<ViewSwitcher value={view} onChange={setView} options={["list", "kanban"]} />
				<button
					type="button"
					onClick={() => setFormOpen(true)}
					className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
					+ New task
				</button>
			</div>

			{view === "kanban" ? (
				<TaskKanbanBoard
					tasks={tasks.filter((task) => !task.parentTaskId)}
					onStatusChange={(taskId, status) => updateMutation.mutate({ taskId, values: { status } })}
					onReorder={(taskId, order) => {
						if (order === null) {
							// sibling order gap exhausted -> renumber, then the next drag works again
							renumberMutation.mutate(null);
							return;
						}
						updateMutation.mutate({ taskId, values: { order } });
					}}
					onOpen={setOpenTaskId}
				/>
			) : (
				<TaskListView
					tasks={tasks}
					onToggleComplete={handleToggleComplete}
					onEdit={(task) => {
						setEditedTask(task);
						setFormOpen(true);
					}}
					onDelete={setTaskToDelete}
					onAddSubtask={(task) => {
						setParentTask(task);
						setFormOpen(true);
					}}
				/>
			)}

			<Modal
				open={formOpen}
				onClose={closeForm}
				title={editedTask ? "Edit task" : parentTask ? "New subtask" : "New task"}>
				<TaskForm
					key={editedTask?._id ?? parentTask?._id ?? "new"}
					initialValues={editedTask ?? undefined}
					projectId={projectId}
					parentTaskId={parentTask?._id}
					parentTaskName={parentTask?.name}
					loading={saveMutation.isPending}
					onSubmit={saveMutation.mutate}
					onCancel={closeForm}
				/>
			</Modal>

			<TaskDetailDialog
				open={Boolean(openTask)}
				task={openTask}
				subtasks={openTaskSubtasks}
				onClose={() => setOpenTaskId(null)}
				onEdit={(task) => {
					setOpenTaskId(null);
					setEditedTask(task);
					setFormOpen(true);
				}}
				onDelete={(task) => {
					setOpenTaskId(null);
					setTaskToDelete(task);
				}}
				onToggleComplete={handleToggleComplete}
				onEditSubtask={(task) => {
					setOpenTaskId(null);
					setEditedTask(task);
					setFormOpen(true);
				}}
				onDeleteSubtask={setTaskToDelete}
				onAddSubtask={(task) => {
					setOpenTaskId(null);
					setParentTask(task);
					setFormOpen(true);
				}}
			/>

			<ConfirmDialog
				open={Boolean(taskToDelete)}
				title={`Delete task "${taskToDelete?.name}"?`}
				description="All its subtasks will be deleted too."
				confirmLabel="Delete"
				destructive
				onConfirm={() => {
					deleteMutation.mutate(taskToDelete._id);
					setTaskToDelete(null);
				}}
				onCancel={() => setTaskToDelete(null)}
			/>
		</div>
	);
};

export { TasksTab };
