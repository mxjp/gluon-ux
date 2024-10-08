import { themeClass } from "../test.js";

function assertCollapse(collapse: Element): asserts collapse is HTMLDivElement {
	if (!collapse.matches(`.${themeClass("collapse")}`)) {
		throw new Error("collapse must be a collapse root element.");
	}
}

/**
 * Get the content element of a collapse.
 */
export function getCollapseContent(collapse: Element): HTMLDivElement {
	assertCollapse(collapse);
	return collapse.querySelector<HTMLDivElement>(`.${themeClass("collapse_content")}`)!;
}

/**
 * Check if a collapse is visible.
 */
export function isCollapseVisible(collapse: Element): boolean {
	assertCollapse(collapse);
	return !collapse.hasAttribute("inert");
}
