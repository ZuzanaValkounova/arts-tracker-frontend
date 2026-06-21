import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
			<Compass className="size-12 text-muted-foreground" />
			<div>
				<h1 className="text-3xl font-bold">404</h1>
				<p className="mt-1 text-sm text-muted-foreground">This page wandered off the canvas.</p>
			</div>
			<Button asChild>
				<Link to="/">Back to projects</Link>
			</Button>
		</div>
	);
};

export { NotFoundPage };
