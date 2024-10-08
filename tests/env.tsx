import { onTeardownLeak } from "@mxjp/gluon/test";
import { JSDOM } from "jsdom";

onTeardownLeak(() => {
	throw new Error("teardown leak");
});

const dom = new JSDOM(`
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>gluon-ux!</title>
		</head>
		<body></body>
	</html>
`);

for (const key of [
	"window",
	"document",
	"Range",
	"Node",
	"MouseEvent",
	"KeyboardEvent",
	"CustomEvent",
	"Comment",
	"DocumentFragment",
	"HTMLDivElement",
	"HTMLButtonElement",
	"HTMLInputElement",
]) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	(globalThis as any)[key] = dom.window[key];
}
