import type { components } from "@front-dashboard/api";
import { ProductCard } from "./product-card";

/** The cards of a product list: 2 columns on phones, up to 4 on desktop. */
export function ProductGrid({
  products,
  currency,
}: {
  products: components["schemas"]["ProductSummary"][];
  currency: string;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} currency={currency} />
      ))}
    </ul>
  );
}
