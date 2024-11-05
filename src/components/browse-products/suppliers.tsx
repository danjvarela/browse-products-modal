"use client";

import { searchSuppliers } from "@/actions/suppliers";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Search } from "lucide-react";
import { useBrowseProductsContext } from "./provider";
import { Input } from "@/components/ui/input";
import { useCallback, useMemo, useState } from "react";
import debounce from "lodash/debounce";

export function Suppliers() {
  const { setSelectedSupplier, setView } = useBrowseProductsContext();
  const [searchVal, setSearchVal] = useState("");

  const { data: suppliers } = useQuery({
    queryKey: ["suppliers", searchVal],
    queryFn: async () => await searchSuppliers(searchVal),
  });

  const debouncedSetSearchVal = useMemo(() => {
    return debounce(setSearchVal, 300);
  }, [setSearchVal]);

  const selectSupplier = useCallback(
    (supplier: Supplier) => {
      setSelectedSupplier(supplier);
      setView("products");
    },
    [setView, setSelectedSupplier],
  );

  return (
    <>
      <div className="px-1000">
        <div className="relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-3">
            <Search className="w-500 h-500" />
          </div>
          <Input
            placeholder="Search suppliers"
            className="pl-11 text-sm"
            onChange={(e) => debouncedSetSearchVal(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-600 border-y border-th-gray-100 h-[414px] px-1000">
        <div className="overflow-auto h-full">
          <Accordion type="multiple">
            {suppliers?.map((supplier) => {
              return (
                <AccordionItem value={supplier.id} key={supplier.id}>
                  <AccordionHeader>
                    <AccordionTrigger
                      className="w-full h-[38px] flex border-b border-th-gray-100 text-sm focus-visible:bg-th-blue-50 select-none px-300 items-center justify-between group transition-colors hover:bg-th-blue outline-none hover:text-white"
                      onClick={() => selectSupplier(supplier)}
                    >
                      <span>{supplier.name}</span>
                      <ChevronRight className="w-500 h-500 text-th-gray-300 group-hover:text-white group-focus-visible:text-th-primary" />
                    </AccordionTrigger>
                  </AccordionHeader>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </>
  );
}
