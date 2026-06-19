import { request } from "./client";

const getProjectStatistics = (token, query = {}) =>
	request("/api/statistics/projects", { method: "GET", token, query });

const getTaskStatistics = (token, query = {}) =>
	request("/api/statistics/tasks", { method: "GET", token, query });

const getTimelineStatistics = (token, query) =>
	request("/api/statistics/timeline", { method: "GET", token, query });

export { getProjectStatistics, getTaskStatistics, getTimelineStatistics };
