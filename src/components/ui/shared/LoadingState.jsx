const LoadingState = ({ message = "Loading…" }) => {
	return (
		<div className="flex flex-col items-center justify-center gap-3 p-10">
			<div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
			<p className="text-sm text-gray-500">{message}</p>
		</div>
	);
};

export { LoadingState };
