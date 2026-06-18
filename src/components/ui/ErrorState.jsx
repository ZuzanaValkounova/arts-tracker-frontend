const ErrorState = ({ message = "Something went wrong.", onRetry }) => {
	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 p-10 text-center">
			<p className="text-sm text-red-700">{message}</p>
			{onRetry && (
				<button
					type="button"
					onClick={onRetry}
					className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100"
				>
					Try again
				</button>
			)}
		</div>
	);
};

export { ErrorState };
