import { sig } from "rvx";
import { Button, Checkbox, Column, Heading, Row, Text, Value } from "@rvx/ui";

export default function() {
	const checked = sig<boolean | undefined>(undefined);

	return <>
		<Heading level="1">Checkboxes</Heading>
		<Column size="control">
			<Checkbox checked={checked}>Editable checkbox</Checkbox>
		</Column>
		<Text>
			Checkbox state: <Value>{() => checked.value === undefined ? "Mixed" : (checked.value ? "Checked" : "Unchecked")}</Value>
		</Text>
		<Row>
			<Button action={() => { checked.value = undefined; }} disabled={() => checked.value === undefined}>Reset to mixed</Button>
		</Row>

		<Heading level="2">States</Heading>
		<Column size="control">
			<Checkbox checked={sig(true)} disabled>Disabled</Checkbox>
			<Checkbox checked={true}>Readonly</Checkbox>
		</Column>
	</>;
}
