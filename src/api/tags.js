import { request } from "./client";

const getTags = (token) => request("/api/tags", { method: "GET", token });

const createTag = (token, values) => request("/api/tags", { method: "POST", token, body: values });

const updateTag = (token, tagId, values) =>
	request(`/api/tags/${tagId}`, { method: "PATCH", token, body: values });

const deleteTag = (token, tagId) => request(`/api/tags/${tagId}`, { method: "DELETE", token });

export { getTags, createTag, updateTag, deleteTag };
