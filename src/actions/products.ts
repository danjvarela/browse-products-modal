import importedProducts from "@/data/products.json";
import { searchStr } from "@/lib/utils";

const products = importedProducts.data;

export async function searchProductsFromSupplier(
  supplierId: string,
  keyword?: string,
): Promise<Product[]> {
  if (!keyword)
    return products.filter((product) => product.supplierId === supplierId);

  const filteredProducts: Product[] = [];

  for (const p of products) {
    if (p.supplierId !== supplierId) continue;

    if (searchStr(p.name, keyword)) {
      filteredProducts.push(p);
      continue;
    }

    const newChildProducts: ChildProduct[] = [];

    for (const child of p.childProducts) {
      if (searchStr(child.sku, keyword) || searchStr(child.name, keyword)) {
        newChildProducts.push(child);
      }
    }

    if (newChildProducts.length) {
      filteredProducts.push({ ...p, childProducts: newChildProducts });
    }
  }

  return filteredProducts;
}
