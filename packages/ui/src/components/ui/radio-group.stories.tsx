import type { Meta, StoryObj } from "@storybook/react-vite";
import { useFormText } from "../../storybook/form-text";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
  title: "Primitives/RadioGroup",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

function Plans({ orientation, disableTeam }: { orientation?: "horizontal" | "vertical"; disableTeam?: boolean }) {
  const t = useFormText();
  const plans = [
    { value: "free", label: t.free },
    { value: "pro", label: t.pro },
    { value: "team", label: t.team },
  ];
  return (
    <RadioGroup
      defaultValue="free"
      orientation={orientation}
      aria-label={t.plan}
      className={orientation === "horizontal" ? "flex flex-row gap-6" : undefined}
    >
      {plans.map(({ value, label }) => (
        <div key={value} className="flex items-center gap-2">
          <RadioGroupItem value={value} id={`sb-plan-${value}`} disabled={disableTeam && value === "team"} />
          <Label htmlFor={`sb-plan-${value}`}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}

export const Vertical: Story = { render: () => <Plans orientation="vertical" /> };
export const Horizontal: Story = { render: () => <Plans orientation="horizontal" /> };
export const WithDisabledOption: Story = { render: () => <Plans disableTeam /> };
