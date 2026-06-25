import { request } from "./client";

const getCategories = (token) => request("/api/categories", { method: "GET", token });

export { getCategories };
