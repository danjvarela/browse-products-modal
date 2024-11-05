"use client";

import { Image, Trash2 } from "lucide-react";
import { SelectedChildProduct, useBrowseProductsContext } from "./provider";
import { useCallback, useRef, useState } from "react";
import { ProductCountInput } from "./product-count-input";
import { useToast } from "../ui/toast";
import { Button } from "../ui/button";
import { ToastClose } from "@radix-ui/react-toast";

function SelectedProductItem({
  selected,
  index,
}: {
  selected: SelectedChildProduct;
  index: number;
}) {
  const [count, setCount] = useState(selected.count);
  const {
    removeChildProduct,
    setView,
    selectedChildProducts,
    selectChildProduct,
  } = useBrowseProductsContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const { add: addToast } = useToast();

  const handleClick = useCallback(() => {
    inputRef?.current?.focus();
  }, []);

  const handleDelete = useCallback(
    (e: any) => {
      e.stopPropagation();
      removeChildProduct(selected.childProduct.id);

      addToast({
        children: (
          <>
            <p>
              Delete{" "}
              <span className="font-bold">
                SKU: {selected.childProduct.sku}
              </span>{" "}
              successfully.
            </p>
            <ToastClose asChild>
              <Button
                variant="outlined"
                className="text-sm px-1 py-0.5 h-fit w-fit mt-2 hover:bg-th-green-600/25"
                onClick={() => {
                  selectChildProduct(selected.childProduct, selected.count);
                }}
              >
                Undo
              </Button>
            </ToastClose>
          </>
        ),
      });
      if (selectedChildProducts.size === 1) {
        setView("products");
      }
    },
    [
      selected,
      removeChildProduct,
      setView,
      selectedChildProducts,
      addToast,
      selectChildProduct,
    ],
  );

  return (
    <div
      role="button"
      className="flex items-center gap-500 py-500 transition-colors hover:bg-th-gray-50 px-1000 border-b border-th-gray-100"
      key={selected.childProduct.id}
      onClick={handleClick}
    >
      <div className="pr-100">{index + 1}</div>
      <div className="w-[50px] aspect-square border rounded border-th-gray-300 flex items-center justify-center">
        <Image className="w-1000 h-1000" strokeWidth="1" />
      </div>
      <div className="w-full flex flex-col">
        <span className="font-bold text-sm leading-none">
          {selected.childProduct.sku}
        </span>
        <span className="leading-none line-clamp-1">
          {selected.childProduct.name}
        </span>
        <span className="text-th-gray-500 text-sm">
          ID: {selected.childProduct.id}
        </span>
      </div>
      <ProductCountInput
        value={count}
        onChange={setCount}
        childProduct={selected.childProduct}
        className="ml-100 w-[68px] shrink-0"
        ref={inputRef}
      />
      <button className="shrink-0" onClick={handleDelete}>
        <Trash2 className="w-500 h-500 transition-colors hover:text-th-gray-500" />
      </button>
    </div>
  );
}

export function SelectedProducts() {
  const { selectedChildProducts } = useBrowseProductsContext();

  return (
    <div className="border-y border-th-gray-100 h-full">
      <div className="overflow-auto h-full max-h-[478px]">
        {Array.from(selectedChildProducts.values()).map((selected, index) => {
          return (
            <SelectedProductItem
              key={selected.childProduct.id}
              index={index}
              selected={selected}
            />
          );
        })}
      </div>
    </div>
  );
}
