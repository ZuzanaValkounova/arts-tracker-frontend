const STEP = 65536;

// project progress from its tasks (computed on FE)
const computeProgress = (tasks = []) => {
	const total = tasks.length;
	const completed = tasks.filter((task) => task.status === "completed").length;
	return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
};

// flat list -> tree: [{ ...task, children: [...] }], siblings sorted by order
const buildTaskTree = (tasks = []) => {
	const byId = new Map(tasks.map((task) => [task._id, { ...task, children: [] }]));
	const roots = [];
	byId.forEach((task) => {
		const parent = task.parentTaskId ? byId.get(task.parentTaskId) : null;
		if (parent) {
			parent.children.push(task);
		} else {
			roots.push(task);
		}
	});
	const sortByOrder = (nodes) => {
		nodes.sort((a, b) => a.order - b.order);
		nodes.forEach((node) => sortByOrder(node.children));
	};
	sortByOrder(roots);
	return roots;
};

// integer order between two siblings
// returns null when the gap is exhausted -> must PATCH /tasks/renumber and retry
const midpointOrder = (prevOrder, nextOrder) => {
	if (prevOrder == null && nextOrder == null) return STEP;
	if (prevOrder == null) return Math.floor(nextOrder / 2) || null;
	if (nextOrder == null) return prevOrder + STEP;
	const mid = Math.floor((prevOrder + nextOrder) / 2);
	return mid > prevOrder && mid < nextOrder ? mid : null;
};

const isOverdue = (task) =>
	Boolean(task.deadline) && task.status !== "completed" && new Date(task.deadline) < new Date();

export { STEP, computeProgress, buildTaskTree, midpointOrder, isOverdue };
