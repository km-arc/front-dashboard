import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLocale } from "../../i18n/locale-provider";
import { Button } from "./button";
import { EmptyState } from "./empty-state";

const meta = {
  title: "Data display/EmptyState",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const HINT = { en: "Try changing your filters.", fa: "فیلترها را تغییر دهید." } as const;

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function Demo({ withAction }: { withAction: boolean }) {
  const { locale, t } = useLocale();
  return (
    <EmptyState
      className="w-96 max-w-full"
      icon={<SearchIcon />}
      title={t("common.noResults")}
      description={HINT[locale]}
      action={withAction ? <Button variant="outline">{t("common.retry")}</Button> : undefined}
    />
  );
}

export const WithAction: Story = { render: () => <Demo withAction /> };
export const WithoutAction: Story = { render: () => <Demo withAction={false} /> };
