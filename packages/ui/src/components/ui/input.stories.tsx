import type { Meta, StoryObj } from "@storybook/react-vite";
import { useFormText } from "../../storybook/form-text";
import { Input, type InputProps } from "./input";
import { Label } from "./label";

const meta = {
  title: "Primitives/Input",
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

function Field({ id, label, ...props }: InputProps & { id: string; label: string }) {
  return (
    <div className="flex w-72 max-w-full flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}

function TextField() {
  const t = useFormText();
  return <Field id="sb-text" label={t.label} placeholder={t.placeholder} />;
}

/** Email stays LTR even on an RTL page (see getInputDir). */
function EmailField() {
  const t = useFormText();
  return <Field id="sb-email" label={t.email} type="email" defaultValue={t.emailValue} />;
}

function NumberField() {
  const t = useFormText();
  return <Field id="sb-number" label={t.quantity} type="number" defaultValue={3} />;
}

function DisabledField() {
  const t = useFormText();
  return <Field id="sb-disabled" label={t.label} placeholder={t.placeholder} disabled />;
}

function InvalidField() {
  const t = useFormText();
  return (
    <div className="flex w-72 max-w-full flex-col gap-2">
      <Field
        id="sb-invalid"
        label={t.label}
        defaultValue={t.placeholder}
        aria-invalid="true"
        aria-describedby="sb-invalid-hint"
      />
      <span id="sb-invalid-hint" className="text-sm text-destructive">
        {t.invalid}
      </span>
    </div>
  );
}

export const Plain: Story = { render: () => <TextField /> };
export const Email: Story = { render: () => <EmailField /> };
export const Numeric: Story = { render: () => <NumberField /> };
export const Disabled: Story = { render: () => <DisabledField /> };
export const Invalid: Story = { render: () => <InvalidField /> };
