// @vitest-environment jsdom
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { directions, expectNoA11yViolations, renderWithDir } from "../../test/utils";
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
import "../../test/polyfills";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.email("Invalid email"),
  country: z.string().min(1, "Choose a country"),
  plan: z.enum(["free", "pro"], "Choose a plan"),
  accept: z.boolean().refine((value) => value, "You must accept"),
  notify: z.boolean(),
});
type Values = z.infer<typeof schema>;

function PlanGroup({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { formLabelId } = useFormField();
  return (
    <FormControl>
      <RadioGroup aria-labelledby={formLabelId} value={value} onValueChange={onChange}>
        {["free", "pro"].map((plan) => (
          <div key={plan} className="flex items-center gap-2">
            <RadioGroupItem value={plan} id={`${formLabelId}-${plan}`} />
            <Label htmlFor={`${formLabelId}-${plan}`}>{plan === "free" ? "Free" : "Pro"}</Label>
          </div>
        ))}
      </RadioGroup>
    </FormControl>
  );
}

function Harness({
  onSubmit = () => {},
  defaults,
}: {
  onSubmit?: (values: Values) => void;
  defaults?: Partial<Values>;
}) {
  const form = useForm<Values>({
    resolver: standardSchemaResolver(schema),
    defaultValues: { name: "", email: "", country: "", accept: false, notify: false, ...defaults },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>As on your ID</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ir">Iran</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
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
              <FormLabel>Plan</FormLabel>
              <PlanGroup value={field.value ?? ""} onChange={field.onChange} />
              <FormMessage />
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
                <FormLabel>Accept the terms</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notify"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Notifications</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}

function messageOf(control: HTMLElement): string {
  const ids = (control.getAttribute("aria-describedby") ?? "").split(" ");
  const last = ids[ids.length - 1] ?? "";
  return document.getElementById(last)?.textContent ?? "";
}

describe.each(directions)("Form (%s)", (dir) => {
  it("connects every label to its control", () => {
    renderWithDir(<Harness />, dir);
    expect(screen.getByLabelText("Name").tagName).toBe("INPUT");
    expect(screen.getByLabelText("Email").getAttribute("type")).toBe("email");
    expect(screen.getByLabelText("Country").getAttribute("role")).toBe("combobox");
    expect(screen.getByLabelText("Accept the terms").getAttribute("role")).toBe("checkbox");
    expect(screen.getByLabelText("Notifications").getAttribute("role")).toBe("switch");
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeTruthy();
  });

  it("describes a field by its description until it has an error", async () => {
    renderWithDir(<Harness />, dir);
    const name = screen.getByLabelText("Name");
    await waitFor(() => expect(name.getAttribute("aria-describedby")).toBeTruthy());
    expect(messageOf(name)).toBe("As on your ID");
    expect(name.getAttribute("aria-invalid")).toBeNull();
  });

  it("shows accessible errors after an empty submit", async () => {
    renderWithDir(<Harness />, dir);
    await userEvent.setup().click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Name is too short")).toBeTruthy();
    for (const text of ["Invalid email", "Choose a country", "Choose a plan", "You must accept"]) {
      expect(screen.getByText(text)).toBeTruthy();
    }
    const name = screen.getByLabelText("Name");
    expect(name.getAttribute("aria-invalid")).toBe("true");
    expect(messageOf(name)).toBe("Name is too short");
  });

  it("clears an error once the value is fixed", async () => {
    renderWithDir(<Harness />, dir);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Save" }));
    await screen.findByText("Name is too short");
    await user.type(screen.getByLabelText("Name"), "Ada");
    await waitFor(() => expect(screen.queryByText("Name is too short")).toBeNull());
    expect(screen.getByLabelText("Name").getAttribute("aria-invalid")).toBeNull();
  });

  it("submits the typed values", async () => {
    const onSubmit = vi.fn();
    renderWithDir(<Harness onSubmit={onSubmit} defaults={{ country: "ir" }} />, dir);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.click(screen.getByRole("radio", { name: "Pro" }));
    await user.click(screen.getByLabelText("Accept the terms"));
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      country: "ir",
      plan: "pro",
      accept: true,
      notify: false,
    });
  });

  it("has no a11y violations, including with errors shown", async () => {
    const { container } = renderWithDir(<Harness />, dir);
    await expectNoA11yViolations(container);
    await userEvent.setup().click(screen.getByRole("button", { name: "Save" }));
    await screen.findByText("Name is too short");
    await expectNoA11yViolations(container);
  });
});
