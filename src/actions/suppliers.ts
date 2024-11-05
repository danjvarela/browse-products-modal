import suppliers from "@/data/suppliers.json";
import { searchStr } from "@/lib/utils";

export async function searchSuppliers(keyword: string): Promise<Supplier[]> {
  if (!keyword) return suppliers;

  return suppliers.filter((supplier) => searchStr(supplier.name, keyword));
}
