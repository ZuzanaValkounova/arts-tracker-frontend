import { Loader2 } from "lucide-react";

const LoadingState = ({ message = "Loading…" }) => {
	return (
		<div className="flex flex-col items-center justify-center gap-3 p-10">
			<Loader2 className="size-8 animate-spin text-muted-foreground" />
			<p className="text-sm text-muted-foreground">{message}</p>
		</div>
	);
};

export { LoadingState };
