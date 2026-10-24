import type { Meta, StoryObj } from "@storybook/react-vite";
import { useSampleText } from "../../storybook/sample-text";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

const meta = {
  title: "Primitives/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

function OrderCard() {
  const t = useSampleText();
  return (
    <Card className="w-80 max-w-full">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>{t.body}</CardContent>
      <CardFooter className="justify-between gap-2">
        <span className="text-sm text-muted-foreground">{t.footer}</span>
        <Button size="sm">{t.save}</Button>
      </CardFooter>
    </Card>
  );
}

export const Default: Story = { render: () => <OrderCard /> };
