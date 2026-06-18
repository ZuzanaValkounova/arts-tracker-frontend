import { request, toFormData } from "./client";

const getProjects = (token, filters = {}) =>
	request("/api/projects", { method: "GET", token, query: filters });

const getProject = (token, projectId) =>
	request(`/api/projects/${projectId}`, { method: "GET", token });

const createProject = (token, values) =>
	request("/api/projects", {
		method: "POST",
		token,
		body: values.imageFile ? toFormData(values) : values,
	});

const updateProject = (token, projectId, values) =>
	request(`/api/projects/${projectId}`, {
		method: "PATCH",
		token,
		body: values.imageFile ? toFormData(values) : values,
	});

const deleteProject = (token, projectId) =>
	request(`/api/projects/${projectId}`, { method: "DELETE", token });

// ----- materials -----

// returns { items: [{ _id, inventoryItem, quantity, estimatedCost, actualCost }], totals: { estimated, actual } }
const getProjectMaterials = (token, projectId) =>
	request(`/api/projects/${projectId}/materials`, { method: "GET", token });

const createProjectMaterial = (token, projectId, material) =>
	request(`/api/projects/${projectId}/materials`, { method: "POST", token, body: material });

const updateProjectMaterial = (token, projectId, materialId, material) =>
	request(`/api/projects/${projectId}/materials/${materialId}`, {
		method: "PATCH",
		token,
		body: material,
	});

const removeProjectMaterial = (token, projectId, materialId) =>
	request(`/api/projects/${projectId}/materials/${materialId}`, { method: "DELETE", token });

// ----- reflection -----

const getProjectReflection = (token, projectId) =>
	request(`/api/projects/${projectId}/reflection`, { method: "GET", token });

const upsertProjectReflection = (token, projectId, reflection) =>
	request(`/api/projects/${projectId}/reflection`, { method: "PUT", token, body: reflection });

const removeProjectReflection = (token, projectId) =>
	request(`/api/projects/${projectId}/reflection`, { method: "DELETE", token });

export {
	getProjects,
	getProject,
	createProject,
	updateProject,
	deleteProject,
	getProjectMaterials,
	createProjectMaterial,
	updateProjectMaterial,
	removeProjectMaterial,
	getProjectReflection,
	upsertProjectReflection,
	removeProjectReflection,
};

// const getProjects = async ({ token, categoryIds, tagIds, ...filters }) => {
// 	const params = new URLSearchParams();

// 	for (const [key, value] of Object.entries(filters)) {
// 		if (value !== "" && value !== null) {
// 			params.append(key, value instanceof Date ? value.toISOString() : value);
// 		}
// 	}

// 	categoryIds.forEach((id) => params.append("categoryIds", id));
// 	tagIds.forEach((id) => params.append("tagIds", id));

// 	const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects?${params}`, {
// 		method: "GET",
// 		headers: {
// 			"Content-Type": "application/json",
// 			Authorization: `Bearer ${token}`,
// 		},
// 	});
// 	return await res.json();
// };

// const createProject = async (token, project) => {
// 	const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 			Authorization: `Bearer ${token}`,
// 		},
// 		body: JSON.stringify(project),
// 	});
// 	return await res.json();
// };

// export { getProjects, createProject };
