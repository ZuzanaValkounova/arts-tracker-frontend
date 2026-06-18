import { request, toFormData } from "./client";

// filters: { categoryId, status: "wishlist"|"owned", search }
const getInventoryItems = (token, filters = {}) =>
	request("/api/inventory", { method: "GET", token, query: filters });

const getInventoryItem = (token, itemId) =>
	request(`/api/inventory/${itemId}`, { method: "GET", token });

const createInventoryItem = (token, values) =>
	request("/api/inventory", {
		method: "POST",
		token,
		body: values.imageFile ? toFormData(values) : values,
	});

const updateInventoryItem = (token, itemId, values) =>
	request(`/api/inventory/${itemId}`, {
		method: "PATCH",
		token,
		body: values.imageFile ? toFormData(values) : values,
	});

const deleteInventoryItem = (token, itemId) =>
	request(`/api/inventory/${itemId}`, { method: "DELETE", token });

export {
	getInventoryItems,
	getInventoryItem,
	createInventoryItem,
	updateInventoryItem,
	deleteInventoryItem,
};
