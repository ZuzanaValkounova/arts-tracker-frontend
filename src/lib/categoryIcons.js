import {
	Palette,
	Pencil,
	Amphora,
	Spool,
	Shapes,
	Camera,
	Hammer,
	Gem,
	Tablet,
	Sparkles,
	Tag,
} from "lucide-react";

// Painting=Palette, Drawing=Pencil, Ceramics=Amphora, Textile=Spool,
// Sculpture=Shapes, Photography=Camera, Woodworking=Hammer, Jewelry=Gem, Digital=Tablet, Other=Sparkles
const CATEGORY_ICONS = {
	Palette,
	Pencil,
	Amphora,
	Spool,
	Shapes,
	Camera,
	Hammer,
	Gem,
	Tablet,
	Sparkles,
};

const getCategoryIcon = (name) => CATEGORY_ICONS[name] ?? Tag;

export { CATEGORY_ICONS, getCategoryIcon };
