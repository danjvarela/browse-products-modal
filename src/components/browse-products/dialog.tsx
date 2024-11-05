"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
} from "@radix-ui/react-dialog";
import { ChevronLeft, X } from "lucide-react";
import { Suppliers } from "./suppliers";
import { useBrowseProductsContext } from "./provider";
import { useCallback, useMemo } from "react";
import { Products } from "./products";
import { SelectedProducts } from "./selected-products";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export function BrowseProductsDialog() {
  const {
    selectedSupplier,
    setSelectedSupplier,
    totalProductsSelected,
    view,
    setView,
    selectedChildProducts,
  } = useBrowseProductsContext();
  const router = useRouter();

  const { add: addToast } = useToast();

  const title = useMemo(() => {
    if (view === "suppliers") return "Browse";
    if (view === "products") return selectedSupplier?.name;
    if (view === "selection") return "Selection";
  }, [selectedSupplier, view]);

  const back = useCallback(() => {
    if (view === "products") {
      setSelectedSupplier(undefined);
      setView("suppliers");
      return;
    }

    if (view === "selection") {
      setView("products");
    }
  }, [view, setSelectedSupplier, setView]);

  const showBackButton = useMemo(() => {
    return (
      (view === "products" && !totalProductsSelected) || view === "selection"
    );
  }, [view, totalProductsSelected]);

  const submitProducts = useCallback(() => {
    const skus = Array.from(selectedChildProducts.values())
      .map((value) => value.childProduct.sku)
      .join(", ");

    addToast({
      children: (
        <span>
          Add <span className="font-bold line-clamp-2">{skus}</span>{" "}
          successfully.
        </span>
      ),
    });

    router.push("/purchase-order-detail");
  }, [selectedChildProducts, addToast, router]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Browse Products</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed top-0 left-0 z-50 bg-white/50 backdrop-blur" />
        <DialogContent
          className="fixed overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[750px] h-[660px] bg-white border shadow-[2px_2px_3px_0px_rgba(0,0,0,0.1)]"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="relative w-full h-full flex flex-col">
            <div className="mt-500 px-1000 relative flex justify-center items-center text-xl text-th-gray-500">
              {showBackButton && (
                <Button
                  variant="outlined"
                  className="p-0 left-1000 w-1000 h-1000 absolute"
                  onClick={back}
                >
                  <ChevronLeft className="w-500 h-500" />
                </Button>
              )}
              <DialogTitle>{title}</DialogTitle>
              <DialogClose asChild>
                <Button
                  className="absolute w-1000 h-1000 p-0 right-1000"
                  variant="ghost"
                >
                  <X className="w-500 h-500" />
                </Button>
              </DialogClose>
            </div>

            <div className="mt-1000 flex-1">
              {view === "suppliers" && <Suppliers />}
              {view === "products" && <Products />}
              {view === "selection" && <SelectedProducts />}
            </div>

            <div
              className={cn(
                "mt-500 mb-800 px-1000 flex justify-between",
                view === "selection" && "justify-end",
              )}
            >
              {view !== "selection" && (
                <Button
                  variant="outlined"
                  disabled={!totalProductsSelected}
                  onClick={() => setView("selection")}
                >
                  {totalProductsSelected} products selected
                </Button>
              )}
              <div className="flex gap-400">
                <DialogClose asChild>
                  <Button variant="outlined">Cancel</Button>
                </DialogClose>
                <Button
                  variant="solid"
                  disabled={totalProductsSelected < 1}
                  onClick={submitProducts}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
