import { createElement } from "react";

import { getCategoryIcon } from "@/lib/categoryIcons";

const CategoryIcon = ({ name, className }) => createElement(getCategoryIcon(name), { className });

export { CategoryIcon };
