import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewButton = ({ label = "New", onClick, ...props }) => {
	return (
		<Button type="button" onClick={onClick} {...props}>
			<Plus />
			{label}
		</Button>
	);
};

export { NewButton };
