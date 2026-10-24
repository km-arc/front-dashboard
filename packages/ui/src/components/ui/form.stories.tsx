import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocale } from "../../i18n/locale-provider";
import { useSignupText, type SignupTextKey } from "../../storybook/signup-text";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "./form";
import { Input } from "./input";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Switch } from "./switch";

const meta = {
  title: "Primitives/Form",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function createSchema(t: Record<SignupTextKey, string>) {
  return z.object({
    name: z.string().min(2, t.nameShort),
    email: z.email(t.emailInvalid),
    country: z.string().min(1, t.countryRequired),
    plan: z.enum(["free", "pro"], t.planRequired),
    notify: z.boolean(),
    accept: z.boolean().refine((value) => value, t.acceptRequired),
  });
}
type SignupValues = z.infer<ReturnType<typeof createSchema>>;

function PlanGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const { formLabelId } = useFormField();
  return (
    <FormControl>
      <RadioGroup aria-labelledby={formLabelId} value={value} onValueChange={onChange}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem value={option.value} id={`${formLabelId}-${option.value}`} />
            <Label htmlFor={`${formLabelId}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </FormControl>
  );
}

function SignupForm({ showErrors }: { showErrors: boolean }) {
  const t = useSignupText();
  const schema = useMemo(() => createSchema(t), [t]);
  const [done, setDone] = useState(false);
  const form = useForm<SignupValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: { name: "", email: "", country: "", notify: false, accept: false },
  });

  useEffect(() => {
    if (showErrors) void form.trigger();
  }, [showErrors, form]);

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(() => setDone(true))}
        className="flex w-80 max-w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.name}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>{t.nameHint}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.email}</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.country}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t.choose} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ir">{t.iran}</SelectItem>
                  <SelectItem value="de">{t.germany}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.plan}</FormLabel>
              <PlanGroup
                value={field.value ?? ""}
                onChange={field.onChange}
                options={[
                  { value: "free", label: t.free },
                  { value: "pro", label: t.pro },
                ]}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notify"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>{t.notifications}</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accept"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>{t.accept}</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{t.save}</Button>
        {done ? (
          <p role="status" className="text-sm font-medium text-foreground">
            {t.success}
          </p>
        ) : null}
      </form>
    </Form>
  );
}

/** Remounts on locale change so the schema messages follow the toolbar. */
function LocalizedSignup({ showErrors }: { showErrors: boolean }) {
  const { locale } = useLocale();
  return <SignupForm key={locale} showErrors={showErrors} />;
}

export const Signup: Story = { render: () => <LocalizedSignup showErrors={false} /> };
export const WithErrors: Story = { render: () => <LocalizedSignup showErrors /> };
