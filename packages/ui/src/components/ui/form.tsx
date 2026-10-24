import { Slot } from "@radix-ui/react-slot";
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { cn } from "../../lib/utils";
import { Label } from "./label";

/**
 * Form primitives on top of react-hook-form. They only wire ids and ARIA attributes and show the
 * error text produced by the resolver; validation and its messages stay in the app (e.g. zod locales).
 * `react-hook-form` is a peer dependency so the app and this package share one context.
 */
export const Form = FormProvider;

interface FormFieldContextValue {
  name: string;
}

interface FormItemContextValue {
  id: string;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);
const FormItemContext = createContext<FormItemContextValue | null>(null);

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  const value = useMemo(() => ({ name: props.name as string }), [props.name]);
  return (
    <FormFieldContext.Provider value={value}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

/** Ids and state of the current field. Must be used inside <FormField> and <FormItem>. */
export function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext?.name });

  if (!fieldContext) throw new Error("useFormField must be used inside <FormField>");
  if (!itemContext) throw new Error("useFormField must be used inside <FormItem>");

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id, hasDescription, setHasDescription } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formLabelId: `${id}-form-item-label`,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    hasDescription,
    setHasDescription,
    ...fieldState,
  };
}

export const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = useId();
    const [hasDescription, setHasDescription] = useState(false);
    const value = useMemo(() => ({ id, hasDescription, setHasDescription }), [id, hasDescription]);
    return (
      <FormItemContext.Provider value={value}>
        <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = "FormItem";

export const FormLabel = forwardRef<ElementRef<typeof Label>, ComponentPropsWithoutRef<typeof Label>>(
  ({ className, ...props }, ref) => {
    const { error, formItemId, formLabelId } = useFormField();
    return (
      <Label
        ref={ref}
        id={formLabelId}
        htmlFor={formItemId}
        className={cn(error && "text-destructive", className)}
        {...props}
      />
    );
  },
);
FormLabel.displayName = "FormLabel";

/** Wraps the control (Input, SelectTrigger, Checkbox, ...) and gives it the id and ARIA attributes. */
export const FormControl = forwardRef<ElementRef<typeof Slot>, ComponentPropsWithoutRef<typeof Slot>>(
  (props, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId, hasDescription } = useFormField();
    const describedBy = [hasDescription ? formDescriptionId : null, error ? formMessageId : null]
      .filter(Boolean)
      .join(" ");
    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    );
  },
);
FormControl.displayName = "FormControl";

export const FormDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId, setHasDescription } = useFormField();
    useEffect(() => {
      setHasDescription(true);
      return () => setHasDescription(false);
    }, [setHasDescription]);
    return (
      <p
        ref={ref}
        id={formDescriptionId}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  },
);
FormDescription.displayName = "FormDescription";

/** Shows the field error (announced to assistive technology); falls back to its children. */
export const FormMessage = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error?.message ? String(error.message) : children;
    if (!body) return null;
    return (
      <p
        ref={ref}
        id={formMessageId}
        role={error ? "alert" : undefined}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {body}
      </p>
    );
  },
);
FormMessage.displayName = "FormMessage";
