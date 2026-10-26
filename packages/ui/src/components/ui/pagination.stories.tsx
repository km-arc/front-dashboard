import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pagination } from "./pagination";

const meta = {
  title: "Data display/Pagination",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ initial, pageCount }: { initial: number; pageCount: number }) {
  const [page, setPage] = useState(initial);
  return <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />;
}

/** Digits follow the locale (Persian digits in fa); the arrows flip in RTL. */
export const Start: Story = { render: () => <Demo initial={1} pageCount={12} /> };
export const Middle: Story = { render: () => <Demo initial={6} pageCount={12} /> };
export const End: Story = { render: () => <Demo initial={12} pageCount={12} /> };
export const FewPages: Story = { render: () => <Demo initial={2} pageCount={4} /> };
