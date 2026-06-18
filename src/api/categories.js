import { request } from "./client";

const getCategories = (token) => request("/api/categories", { method: "GET", token });

const getCategoryIcons = (token) => request("/api/categories/icons", { method: "GET", token });

export { getCategories, getCategoryIcons };
