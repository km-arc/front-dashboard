import { notFound } from "next/navigation";

/** Sends every unknown URL under a locale to the localized not-found page. */
export default function CatchAllPage() {
  notFound();
}
