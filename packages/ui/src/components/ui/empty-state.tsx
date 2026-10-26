import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Decorative illustration or icon (hidden from assistive technology). */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Optional call to action, e.g. a Button. */
  action?: ReactNode;
}

/** Placeholder for lists and tables without data. All text comes from props, so the app translates it. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div aria-hidden="true" className="text-muted-foreground [&>svg]:size-10">
          {icon}
        </div>
      ) : null}
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-foreground">{title}</p>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
