import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { z } from "zod";
import { useBrowseProductsContext } from "./provider";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";

const validCount = z.number().gt(0, { message: `can't be less than 1` });

type Props = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "value" | "onChange"
> & {
  childProduct: ChildProduct;
  value: number;
  onChange: (val: number) => void;
};

export const ProductCountInput = React.forwardRef<
  React.ElementRef<"input">,
  Props
>(({ className, value, onChange, childProduct, ...props }, ref) => {
  const { updateSelectedCount } = useBrowseProductsContext();
  const [error, setError] = useState("");
  const updateCount = useCallback(
    (val: number) => {
      updateSelectedCount(childProduct.id, val);
    },
    [childProduct.id],
  );

  const debouncedUpdateCount = useMemo(() => {
    return debounce(updateCount, 300);
  }, [updateCount]);

  const formattedCount = useMemo(() => {
    return value.toFixed(0);
  }, [value]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const parsed = parseInt(e.target.value);

      if (isNaN(parsed)) {
        debouncedUpdateCount(0);
        onChange(0);
        return;
      }

      debouncedUpdateCount(parsed);
      onChange(parsed);
    },
    [childProduct.id, debouncedUpdateCount],
  );

  useEffect(() => {
    validCount.safeParseAsync(value).then((data) => {
      if (!data.success) {
        const message = data.error.issues[0].message;
        setError(message);
      } else {
        setError("");
      }
    });
  }, [value]);

  return (
    <div className={cn(" w-[68px] relative", className)}>
      <Input
        className={cn(
          "text-end h-[28px] text-sm",
          error && "outline-red-500 outline outline-1 animate-shake",
        )}
        type="number"
        value={formattedCount}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        {...props}
        ref={ref}
      />
      <span className="absolute right-0 leading-none tracking-tight -bottom-3 text-nowrap text-end text-xs text-red-500">
        {error}
      </span>
    </div>
  );
});

ProductCountInput.displayName = "ProductCountInput";
