/** Shown while a page streams in. Plain classes: this is a server component and must not load the ui barrel. */
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 p-6" aria-busy="true">
      <div className="h-8 w-1/2 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
    </div>
  );
}
