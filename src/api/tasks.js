import { request } from "./client";

// filters: { projectId, parentTaskId, status: "planned,inProgress", priority, deadlineFrom, deadlineTo, search }
const getTasks = (token, filters = {}) =>
	request("/api/tasks", { method: "GET", token, query: filters });

const getTask = (token, taskId) => request(`/api/tasks/${taskId}`, { method: "GET", token });

// returns { task, project? } — project is present when the new task changed the project status (cascade)
const createTask = (token, values) =>
	request("/api/tasks", { method: "POST", token, body: values });

// returns { task, project?, triggerReflection } — status changes can cascade up
// triggerReflection === true means the project just got completed and has no reflection
// UI should open the ReflectionDialog
const updateTask = (token, taskId, values) =>
	request(`/api/tasks/${taskId}`, { method: "PATCH", token, body: values });

// returns { message, project?, triggerReflection }
const deleteTask = (token, taskId) => request(`/api/tasks/${taskId}`, { method: "DELETE", token });

// reorders siblings; call when drag&drop midpoint collides
const renumberTasks = (token, { projectId, parentTaskId = null }) =>
	request("/api/tasks/renumber", { method: "PATCH", token, body: { projectId, parentTaskId } });

export { getTasks, getTask, createTask, updateTask, deleteTask, renumberTasks };
