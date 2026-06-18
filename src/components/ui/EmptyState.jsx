// action: optional { label, onClick }
const EmptyState = ({ message = "Nothing here yet.", action }) => {
	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 p-10 text-center">
			<p className="text-sm text-gray-500">{message}</p>
			{action && (
				<button
					type="button"
					onClick={action.onClick}
					className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
				>
					{action.label}
				</button>
			)}
		</div>
	);
};

export { EmptyState };
