import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLocale } from "../../i18n/locale-provider";
import { Badge, type BadgeProps } from "./badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta = {
  title: "Data display/Table",
  component: Table,
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const TEXT = {
  en: {
    caption: "Recent orders",
    customer: "Customer",
    status: "Status",
    amount: "Amount",
    date: "Date",
    total: "Total",
    names: ["Ada Lovelace", "Alan Turing", "Grace Hopper"],
    statuses: ["Paid", "Pending", "Failed"],
    amounts: [1250, 310, 99],
    currency: "USD",
  },
  fa: {
    caption: "سفارش‌های اخیر",
    customer: "مشتری",
    status: "وضعیت",
    amount: "مبلغ",
    date: "تاریخ",
    total: "جمع",
    names: ["آیدا احمدی", "سارا کریمی", "رضا نوری"],
    statuses: ["پرداخت‌شده", "در انتظار", "ناموفق"],
    amounts: [1250000, 310000, 99000],
    currency: "IRT",
  },
} as const;

const DATES = ["2026-10-01", "2026-10-12", "2026-10-20"];
const BADGES: NonNullable<BadgeProps["variant"]>[] = ["default", "secondary", "destructive"];

function Orders() {
  const { locale, formatters } = useLocale();
  const t = TEXT[locale];
  const total = t.amounts.reduce((sum, amount) => sum + amount, 0);
  return (
    <Table>
      <TableCaption>{t.caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{t.customer}</TableHead>
          <TableHead>{t.status}</TableHead>
          <TableHead>{t.date}</TableHead>
          <TableHead className="text-end">{t.amount}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {t.names.map((name, index) => (
          <TableRow key={name}>
            <TableCell className="font-medium">{name}</TableCell>
            <TableCell>
              <Badge variant={BADGES[index]}>{t.statuses[index]}</Badge>
            </TableCell>
            <TableCell>{formatters.date(DATES[index] ?? "", "medium")}</TableCell>
            <TableCell className="text-end tabular-nums">
              {formatters.money(t.amounts[index] ?? 0, t.currency)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>{t.total}</TableCell>
          <TableCell className="text-end tabular-nums">
            {formatters.money(total, t.currency)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export const Default: Story = {
  render: () => (
    <div className="w-[36rem] max-w-full">
      <Orders />
    </div>
  ),
};

/** Narrow container: the table scrolls inside its own wrapper. */
export const NarrowContainer: Story = {
  render: () => (
    <div className="w-72 max-w-full">
      <Orders />
    </div>
  ),
};
