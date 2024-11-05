import { cva } from "class-variance-authority";
import React from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonClassName = cva(
  "h-[38px] px-600 rounded transition-all inline-flex items-center justify-center disabled:cursor-not-allowed select-none",
  {
    variants: {
      variant: {
        solid: [
          "bg-th-primary text-white hover:bg-th-primary/90 active:bg-th-primary/80",
          "disabled:border disabled:bg-th-gray-100 disabled:text-th-gray-300",
        ],
        outlined: [
          "border text-th-gray-500 hover:bg-th-gray-100/80 active:bg-th-gray-50",
          "disabled:text-th-gray-300 disabled:active:bg-transparent disabled:hover:bg-transparent",
        ],
        ghost: ["hover:bg-th-gray-100/80 active:bg-th-gray-50"],
      },
    },
    defaultVariants: {
      variant: "solid",
    },
  },
);

type ButtonProps = VariantProps<typeof buttonClassName> &
  React.ComponentPropsWithoutRef<"button">;

export const Button = React.forwardRef<React.ElementRef<"button">, ButtonProps>(
  ({ children, className, variant, ...props }, ref) => {
    return (
      <button
        className={cn(buttonClassName({ variant }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
