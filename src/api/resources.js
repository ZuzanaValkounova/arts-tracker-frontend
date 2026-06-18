import { request, toFormData } from "./client";

const getResources = (token, filters = {}) =>
	request("/api/resources", { method: "GET", token, query: filters });

const createResource = (token, values) =>
	request("/api/resources", {
		method: "POST",
		token,
		body: values.imageFile ? toFormData(values) : values,
	});

const updateResource = (token, resourceId, values) =>
	request(`/api/resources/${resourceId}`, {
		method: "PATCH",
		token,
		body: values.imageFile ? toFormData(values) : values,
	});

const deleteResource = (token, resourceId) =>
	request(`/api/resources/${resourceId}`, { method: "DELETE", token });

export { getResources, createResource, updateResource, deleteResource };
