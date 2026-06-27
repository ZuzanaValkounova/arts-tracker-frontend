import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";
import { badgeVariants } from "./badge-variants";

function Badge({ className, variant, asChild = false, ...props }) {
	const Comp = asChild ? Slot.Root : "span";

	return (
		<Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge };
