import { request } from "./client";

// query: { categoryId?, from?, to? }
// returns { byStatus, byCategory, byDifficulty, byTag, successRate, completedInPeriod, averageDuration, total }
const getProjectStatistics = (token, query = {}) =>
	request("/api/statistics/projects", { method: "GET", token, query });

// query: { projectId?, taskType?: "topLevel"|"subtasks", from?, to? }
// returns { byStatus, byPriority, completedCount, completedInPeriod, averageDuration, total }
const getTaskStatistics = (token, query = {}) =>
	request("/api/statistics/tasks", { method: "GET", token, query });

// query: { from!, to!, granularity?: "day"|"week"|"month", categoryId?, projectId?, taskType? }
// returns { granularity, from, to, projects: { created, started, completed }, tasks: { ... } }
// [{ period: "2026-W23", count: 2 }] — empty periods must be filled on the FE
const getTimelineStatistics = (token, query) =>
	request("/api/statistics/timeline", { method: "GET", token, query });

export { getProjectStatistics, getTaskStatistics, getTimelineStatistics };
