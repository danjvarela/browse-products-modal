"use client";

import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Image, Search } from "lucide-react";
import { useBrowseProductsContext } from "./provider";
import { Input } from "@/components/ui/input";
import { searchProductsFromSupplier } from "@/actions/products";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ProductCountInput } from "./product-count-input";

function ChildProductItem({ childProduct }: { childProduct: ChildProduct }) {
  const { selectedChildProducts, selectChildProduct, removeChildProduct } =
    useBrowseProductsContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const [count, setCount] = useState(1);

  const isSelected = useMemo(() => {
    return selectedChildProducts.has(childProduct.id);
  }, [selectedChildProducts, childProduct]);

  const handleClick = useCallback(() => {
    if (!isSelected) {
      selectChildProduct(childProduct, count);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      removeChildProduct(childProduct.id);
    }
  }, [isSelected, count, childProduct]);

  return (
    <div
      role="button"
      className={cn(
        "w-full py-500 flex border-b border-th-gray-100 text-sm bg-th-gray-50 select-none items-center justify-between transition-colors outline-none",
        isSelected && "bg-th-blue-50",
      )}
      onClick={handleClick}
    >
      <div className="aspect-square w-[50px] flex items-center justify-end">
        <Checkbox checked={isSelected} />
      </div>
      <div className="flex flex-col flex-1 text-start ml-500">
        <span>{childProduct.name}</span>
        <span className="text-th-gray-500">SKU: {childProduct.sku}</span>
      </div>
      <ProductCountInput
        childProduct={childProduct}
        ref={inputRef}
        value={count}
        onChange={setCount}
        disabled={!isSelected}
        className="ml-600 mr-400"
      />
    </div>
  );
}

function ProductItem({ product }: { product: Product }) {
  const { selectedChildProducts } = useBrowseProductsContext();

  const hasSelectedChild = useMemo(() => {
    return product.childProducts.some((childProduct) =>
      selectedChildProducts.has(childProduct.id),
    );
  }, [product, selectedChildProducts]);

  return (
    <AccordionItem value={product.id}>
      <AccordionHeader>
        <AccordionTrigger
          className={cn(
            "w-full py-500 data-[state=open]:bg-th-gray-50 flex border-b border-th-gray-100 text-sm focus-visible:bg-th-gray-50 select-none group items-center justify-between gap-500 group transition-colors outline-none hover:bg-th-gray-50",
            hasSelectedChild &&
              "bg-th-blue-50 hover:bg-th-blue-50 data-[state=open]:bg-th-blue-50",
          )}
        >
          <div className="items-center flex gap-500">
            <div className="w-[50px] aspect-square border rounded border-th-gray-300 flex items-center justify-center">
              <Image className="w-1000 h-1000" strokeWidth="1" />
            </div>
            <div className="flex flex-col text-start">
              <span>{product.name}</span>
              <span className="text-th-gray-300 group-hover:text-th-gray-500 group-data-[state=open]:text-th-gray-500 group-focus-visible:text-th-gray-500">
                ID: {product.id}
              </span>
            </div>
          </div>
          <ChevronRight className="w-500 h-500 text-th-gray-300 mr-300 group-hover:text-th-primary group-focus-visible:text-th-primary group-data-[state=open]:rotate-90 transition-all" />
        </AccordionTrigger>
      </AccordionHeader>
      {product.childProducts.length && (
        <AccordionContent className="flex flex-col">
          {product.childProducts.map((childProduct) => {
            return (
              <ChildProductItem
                key={childProduct.id}
                childProduct={childProduct}
              />
            );
          })}
        </AccordionContent>
      )}
    </AccordionItem>
  );
}

export function Products() {
  const { selectedSupplier } = useBrowseProductsContext();
  const [value, setValue] = useState<string[]>([]);
  const [valueWhenSearching, setValueWhenSearching] = useState<
    string[] | undefined
  >([]);

  const [searchVal, setSearchVal] = useState("");

  const { data: products } = useQuery({
    queryKey: ["products", searchVal],
    queryFn: async () =>
      await searchProductsFromSupplier(selectedSupplier?.id!, searchVal),
  });

  const debouncedSetSearchVal = useMemo(() => {
    return debounce(setSearchVal, 300);
  }, [setSearchVal]);

  useEffect(() => {
    setValueWhenSearching(
      searchVal ? products?.map((v) => v.id) || [] : undefined,
    );
  }, [searchVal, products]);

  return (
    <>
      <div className="px-1000">
        <div className="relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-3">
            <Search className="w-500 h-500" />
          </div>
          <Input
            placeholder="Search products"
            className="pl-11 text-sm"
            onChange={(e) => debouncedSetSearchVal(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-600 border-y border-th-gray-100 h-[414px] px-1000">
        <div className="overflow-auto h-full">
          <Accordion
            type="multiple"
            value={valueWhenSearching || value}
            onValueChange={setValue}
          >
            {products?.map((product) => {
              return <ProductItem key={product.id} product={product} />;
            })}
          </Accordion>
        </div>
      </div>
    </>
  );
}
