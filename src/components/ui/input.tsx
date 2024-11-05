import { cn } from "@/lib/utils";
import React from "react";

type InputProps = React.ComponentPropsWithoutRef<"input">;

export const Input = React.forwardRef<React.ElementRef<"input">, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "w-full border px-300 rounded h-[42px] disabled:cursor-not-allowed disabled:text-th-gray-300",
          className,
        )}
        {...props}
        ref={ref}
      />
    );
  },
);

Input.displayName = "Input";
