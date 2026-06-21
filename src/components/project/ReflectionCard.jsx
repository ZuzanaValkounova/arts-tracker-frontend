import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

const ReflectionCard = ({ reflection, onEdit }) => {
	if (!reflection) return null;

	const sections = [
		{ label: "What worked", value: reflection.whatWorked },
		{ label: "What didn't work", value: reflection.whatDidntWork },
		{ label: "What to improve", value: reflection.whatToImprove },
	];

	return (
		<section className="flex flex-col gap-2 rounded-lg border bg-card p-4">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold">Reflection</h3>
				{onEdit && (
					<Button type="button" variant="ghost" size="sm" onClick={onEdit}>
						<Pencil />
						Edit
					</Button>
				)}
			</div>
			{sections.map(
				({ label, value }) =>
					value && (
						<div key={label}>
							<div className="text-xs font-medium text-muted-foreground">{label}</div>
							<p className="whitespace-pre-wrap text-sm text-foreground">{value}</p>
						</div>
					),
			)}
		</section>
	);
};

export { ReflectionCard };
