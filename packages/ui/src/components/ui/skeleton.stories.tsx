import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardContent, CardHeader } from "./card";
import { Skeleton } from "./skeleton";

const meta = {
  title: "Overlays/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

function CardPlaceholder() {
  return (
    <Card className="w-80 max-w-full">
      <CardHeader>
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
  );
}

export const Line: Story = { render: () => <Skeleton className="h-4 w-48" /> };
export const CardLoading: Story = { render: () => <CardPlaceholder /> };
