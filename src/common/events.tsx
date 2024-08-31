import { waitFor } from "@mxjp/gluon/async";

/**
 * Get an identifier for the pressed key including any modifiers.
 *
 * The identifier is constructed by concatenating the modifies and lower cased key. In additional, the space key is represented as `space` for better readability.
 *
 * Modifiers in order:
 * + `ctrl+`
 * + `shift+`
 * + `alt+`
 * + `meta+`
 *
 * Examples:
 * + `shift+a`
 * + `ctrl+shift+space`
 *
 * @returns The identifier.
 */
export function keyFor(event: KeyboardEvent): string {
	let key = event.key.toLowerCase();
	if (key === " ") {
		key = "space";
	}
	if (event.metaKey) {
		key = "meta+" + key;
	}
	if (event.altKey) {
		key = "alt+" + key;
	}
	if (event.shiftKey) {
		key = "shift+" + key;
	}
	if (event.ctrlKey) {
		key = "ctrl+" + key;
	}
	return key;
}

/**
 * A function to run an optionally async user action.
 *
 * This should return false to indicate, that no action was performed.
 */
export type Action<T extends unknown[] = []> = (event: Event, ...args: T) => void | boolean | Promise<void>;

/**
 * Call an action that was triggered by the specified event.
 */
export function handleActionEvent<T extends unknown[]>(event: Event, action: Action<T>, ...args: T): boolean {
	const result = action(event, ...args);
	if (result === false) {
		return false;
	}
	event.preventDefault();
	event.stopImmediatePropagation();
	if (result instanceof Promise) {
		waitFor(result);
	}
	return true;
}

export function startDelayedHoverOnMouseenter(event: MouseEvent, action: () => void, delay = 300): void {
	const timer = setTimeout(action, delay);
	const cancel = () => {
		event.target?.removeEventListener("mouseleave", cancel);
		event.target?.removeEventListener("mousedown", cancel, { capture: true });
		event.target?.removeEventListener("touchstart", cancel, { capture: true });
		clearTimeout(timer);
	};
	event.target?.addEventListener("mouseleave", cancel);
	event.target?.addEventListener("mousedown", cancel, { capture: true });
	event.target?.addEventListener("touchstart", cancel, { capture: true });
}

export const DELAYED_HOVER_EVENT = "gluon-ux:delayed-hover";

export function createDelayedHoverEvent(): Event {
	return new CustomEvent(DELAYED_HOVER_EVENT);
}
