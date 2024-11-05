"use client";

import { cn } from "@/lib/utils";
import {
  ToastProvider as RxToastProvider,
  ToastViewport,
  Toast as RxToast,
  ToastClose,
} from "@radix-ui/react-toast";
import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { cva, VariantProps } from "class-variance-authority";
import { Check, X } from "lucide-react";
import { Button } from "./button";
import { v4 as uuidv4 } from "uuid";

const toastClassName = cva(
  [
    "w-[358px] p-4 rounded-l-lg rounded-r border-l-8 flex items-start justify-between",
    "shadow-[-1px_2px_4px_0px_rgba(0,0,0,0.25)] gap-4 transition-all",
    "data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
    "data-[state=closed]:animate-out data-[state=closed]:slide-out-from-right",
  ],
  {
    variants: {
      variant: {
        success: ["border-th-green-600 bg-th-green-50"],
      },
    },
    defaultVariants: {
      variant: "success",
    },
  },
);

type ToastProps = VariantProps<typeof toastClassName> &
  React.ComponentPropsWithoutRef<typeof RxToast>;

type ToastContextValue = {
  toasts: Map<string, ToastProps>;
  add: (toast: ToastProps) => void;
  remove: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (typeof ctx === "undefined") {
    throw new Error(`useToastContext must be used inside the ToastProvider`);
  }
  return ctx;
};

function toastReducer(
  state: Map<string, ToastProps>,
  action:
    | { type: "add"; toast: ToastProps; id: string }
    | { type: "remove"; id: string },
) {
  const m = new Map(state);

  if (action.type === "add") {
    m.set(action.id, action.toast);
    return m;
  } else if (action.type === "remove") {
    m.delete(action.id);
    return m;
  } else {
    throw new Error("invalid action type");
  }
}

export function ToastProvider({ children }: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(toastReducer, new Map());

  const remove = useCallback((id: string) => {
    dispatch({ type: "remove", id });
  }, []);

  const add = useCallback(
    (toast: ToastProps) => {
      const id = uuidv4();
      dispatch({
        type: "add",
        toast: {
          ...toast,
          onOpenChange(open) {
            if (!open) {
              remove(id);
            }
            toast.onOpenChange?.(open);
          },
        },
        id,
      });
    },
    [remove],
  );

  return (
    <ToastContext.Provider
      value={{
        add,
        toasts: state,
        remove,
      }}
    >
      <RxToastProvider duration={5000}>
        {children}
        <ToastViewport className="fixed bottom-0 right-0 z-[99999] m-0 flex w-[400px] flex-col-reverse outline-none gap-4 p-4" />
      </RxToastProvider>
    </ToastContext.Provider>
  );
}

export const Toast = React.forwardRef<
  React.ElementRef<typeof RxToast>,
  ToastProps
>(({ className, variant, children, ...props }, ref) => {
  return (
    <RxToast
      ref={ref}
      className={cn(toastClassName({ variant }), className)}
      {...props}
    >
      <div className="rounded-full text-white bg-th-green-600 p-1">
        <Check className="w-4 h-4" />
      </div>
      <div className="flex-1 max-w-[220px] text-wrap break-words leading-tight text-sm">
        {children}
      </div>
      <ToastClose asChild>
        <Button
          variant="ghost"
          className="p-1 w-fit h-fit rounded-full hover:bg-th-green-600/25"
        >
          <X className="w-5 h-5" />
        </Button>
      </ToastClose>
    </RxToast>
  );
});
Toast.displayName = "Toast";

export function Toasts() {
  const { toasts } = useToast();

  return (
    <>
      {Array.from(toasts.entries()).map(([id, toast]) => (
        <Toast {...toast} key={id} />
      ))}
    </>
  );
}
