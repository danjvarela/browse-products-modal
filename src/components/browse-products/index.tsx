import { BrowseProductsDialog } from "./dialog";
import { BrowseProductsProvider } from "./provider";

export function BrowseProducts() {
  return (
    <BrowseProductsProvider>
      <BrowseProductsDialog />
    </BrowseProductsProvider>
  );
}
