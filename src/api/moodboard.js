import { request, toFormData } from "./client";

const getMoodboard = (token, projectId) =>
	request(`/api/projects/${projectId}/moodboard`, { method: "GET", token });

const createMoodboard = (token, projectId, elements = []) =>
	request(`/api/projects/${projectId}/moodboard`, { method: "POST", token, body: { elements } });

const deleteMoodboard = (token, projectId) =>
	request(`/api/projects/${projectId}/moodboard`, { method: "DELETE", token });

const createMoodboardElement = (token, projectId, element) =>
	request(`/api/projects/${projectId}/moodboard/elements`, {
		method: "POST",
		token,
		body: element.imageFile ? toFormData(element) : element,
	});

//add formData?
const updateMoodboardElement = (token, projectId, elementId, elementUpdate) =>
	request(`/api/projects/${projectId}/moodboard/elements/${elementId}`, {
		method: "PATCH",
		token,
		body: elementUpdate,
	});

const deleteMoodboardElement = (token, projectId, elementId) =>
	request(`/api/projects/${projectId}/moodboard/elements/${elementId}`, {
		method: "DELETE",
		token,
	});

export {
	getMoodboard,
	createMoodboard,
	deleteMoodboard,
	createMoodboardElement,
	updateMoodboardElement,
	deleteMoodboardElement,
};
