const BASE_URL = import.meta.env.VITE_BACKEND_URL;

class ApiError extends Error {
	constructor(message, status) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

// Builds a query string. Arrays are appended as repeated keys (categoryIds=a&categoryIds=b)
// Empty strings, null and undefined are skipped so they don't fail backend validation.
const buildQuery = (params = {}) => {
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value === undefined || value === null || value === "") return;
		if (Array.isArray(value)) {
			value.forEach((item) => item !== "" && searchParams.append(key, item));
		} else {
			searchParams.append(key, value);
		}
	});
	const query = searchParams.toString();
	return query ? `?${query}` : "";
};

// Shared fetch wrapper.
// - body: plain object (sent as JSON) or FormData (sent as multipart, for image uploads)
// - throws ApiError with the backend's { message } and the HTTP status
const request = async (path, { method = "GET", token, body, query } = {}) => {
	const headers = {};
	if (token) headers.Authorization = `Bearer ${token}`;

	let payload;
	if (body instanceof FormData) {
		payload = body;
	} else if (body !== undefined) {
		headers["Content-Type"] = "application/json";
		payload = JSON.stringify(body);
	}

	if (query && Object.keys(query).length > 0) {
		path += buildQuery(query);
	}

	const res = await fetch(`${BASE_URL}${path}`, {
		method,
		headers,
		body: payload,
	});

	const data = res.status === 204 ? null : await res.json().catch(() => null);

	if (!res.ok) {
		throw new ApiError(data?.message ?? `Request failed (${res.status})`, res.status);
	}

	return data;
};

// Converts values object to FormData for endpoints with upload.single("image").
// imageFile is appended under the "image" field; arrays are appended as repeated keys.
const toFormData = (values) => {
	const formData = new FormData();
	Object.entries(values).forEach(([key, value]) => {
		if (value === undefined || value === null) return;
		if (key === "imageFile") {
			formData.append("image", value);
		} else if (Array.isArray(value)) {
			value.forEach((item) => formData.append(key, item));
		} else {
			formData.append(key, value);
		}
	});
	return formData;
};

export { request, buildQuery, toFormData, ApiError };
