import { DeriveContext, TASKS, Tasks, UseUniqueId, extract, mount, sig, waitFor } from "@mxjp/gluon";
import { Button, Collapse, Column, DialogBody, DialogFooter, Heading, LAYER, Label, RootLayer, Row, THEME, Text, TextInput, ValidationRule, Validator, Value, showDialog, trim, validate } from "@mxjp/gluon-ux";

import theme from "@mxjp/gluon-ux/dist/theme.module.css";

mount(
	document.body,
	<RootLayer>
		{() => <DeriveContext>
			{ctx => {
				ctx.set(THEME, theme);
				ctx.set(TASKS, new Tasks());

				const text = sig("Hello World!");
				const collapse = sig(false);

				return <Column>
					<Heading level="1">Gluon UX</Heading>

					<Heading level="2">Basic Controls</Heading>
					<Row size="control">
						<TextInput value={trim(text)} />
						<Button
							action={async () => {
								console.log("Hello World!");
								await new Promise(r => setTimeout(r, 1000));
							}
						}>Click me!</Button>
					</Row>
					<Text>
						You typed: <Value>{() => JSON.stringify(text.value)}</Value>
					</Text>

					<Heading level="2">Dialogs</Heading>
					<Row>
						<Button action={showExampleDialog}>Show Dialog</Button>
						<Button action={showValidationExample}>Validation Example</Button>
					</Row>

					<Heading level="2">Collapses</Heading>
					<Row size="control">
						<Button action={() => { collapse.value = !collapse.value }}>Toggle</Button>
					</Row>
					<Collapse visible={collapse}>
						<Text>Hello World!</Text>
					</Collapse>

					<Heading level="2">Text Blocks</Heading>
					<Text>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ut cursus augue, in ornare metus. Maecenas vulputate tristique arcu. Morbi rhoncus massa sed facilisis interdum. Vestibulum efficitur id neque in suscipit. Aenean sagittis turpis nec pharetra vehicula. Integer quis semper purus, a commodo justo. Proin at quam sit amet lectus vulputate sodales sed a metus. Suspendisse eleifend sit amet urna non consequat. Aenean non lectus viverra, laoreet tortor sit amet, eleifend enim. Fusce at consequat augue, vitae porttitor nisi. Nullam tincidunt vel quam nec rutrum. Pellentesque nec tincidunt quam. Aliquam volutpat elit sem, quis porttitor risus cursus a. Sed a nunc risus. Nam porta tincidunt libero, quis pretium turpis.
					</Text>
				</Column>;
			}}
		</DeriveContext>}
	</RootLayer>
);

function showExampleDialog() {
	showDialog<number>(dialog => {
		extract(LAYER)?.useHotkey("enter", () => {
			dialog.resolve(77);
		});
		return <DialogBody title="Example Dialog" description="This is an accessible example dialog.">
			<Row>
				<Button autofocus action={() => {
					showDialog<void>(dialog => {
						return <DialogBody title="Nested dialog" description="This is a dialog in a dialog.">
							<DialogFooter>
								<Button action={() => dialog.resolve()}>Close</Button>
							</DialogFooter>
						</DialogBody>;
					});
				}}>
					Open Nested Dialog
				</Button>
			</Row>
			<DialogFooter>
				<Button action={() => dialog.reject()}>Cancel</Button>
				<Button action={() => dialog.resolve(42)} variant="primary">Ok</Button>
			</DialogFooter>
		</DialogBody>;
	}).then(value => {
		console.log("Dialog result:", value);
	}, () => {
		console.log("Dialog was cancelled.");
	});
}

function showValidationExample() {
	showDialog(dialog => {
		const name = sig("");
		const nameRules = new Validator();

		function ok() {
			waitFor(async () => {
				if (await validate(nameRules)) {
					dialog.resolve();
				}
			});
		}

		return <DialogBody title="Validation" description="This dialog demonstrates the validation API.">
			<UseUniqueId>
				{id => <>
					<Label for={id}>Username</Label>
					<TextInput id={id} value={trim(name)} validity={nameRules} />
				</>}
			</UseUniqueId>
			<ValidationRule for={nameRules} validate={() => name.value.length > 0}>
				Enter a name.
			</ValidationRule>
			<ValidationRule for={nameRules} validate={() => /^[a-z0-9]*$/.test(name.value)}>
				The name must contain only "a-z" or "0-9".
			</ValidationRule>

			<DialogFooter>
				<Button action={() => dialog.reject()}>Cancel</Button>
				<Button action={ok} variant="primary">Ok</Button>
			</DialogFooter>
		</DialogBody>;
	});
}
