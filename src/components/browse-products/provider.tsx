"use client";

import {
  useContext,
  createContext,
  PropsWithChildren,
  useState,
  useReducer,
  useCallback,
  useMemo,
} from "react";

export type SelectedChildProduct = {
  childProduct: ChildProduct;
  count: number;
};

type SelectedChildProductsAction =
  | {
      type: "add";
      childProduct: ChildProduct;
      count: number;
    }
  | {
      type: "remove";
      childProductId: string;
    }
  | {
      type: "updateCount";
      count: number;
      childProductId: string;
    };

function selectedChildProductsReducer(
  state: Map<string, SelectedChildProduct>,
  action: SelectedChildProductsAction,
) {
  const mapCopy = new Map(state);

  if (action.type === "add") {
    mapCopy.set(action.childProduct.id, {
      childProduct: action.childProduct,
      count: action.count,
    });
    return mapCopy;
  } else if (action.type === "remove") {
    mapCopy.delete(action.childProductId);
    return mapCopy;
  } else if (action.type === "updateCount") {
    if (!mapCopy.has(action.childProductId)) return state;
    mapCopy.set(action.childProductId, {
      ...mapCopy.get(action.childProductId)!,
      count: action.count,
    });
    return mapCopy;
  } else {
    return state;
  }
}

type View = "suppliers" | "products" | "selection";

type BrowseProductsContextValue = {
  selectedSupplier?: Supplier;
  setSelectedSupplier: (supplier?: Supplier) => void;
  selectChildProduct: (childProduct: ChildProduct, count: number) => void;
  removeChildProduct: (childProductId: string) => void;
  updateSelectedCount: (childProductId: string, count: number) => void;
  selectedChildProducts: Map<string, SelectedChildProduct>;
  totalProductsSelected: number;
  view: View;
  setView: (view: View) => void;
};

const BrowseProductsContext = createContext<
  BrowseProductsContextValue | undefined
>(undefined);

export const useBrowseProductsContext = () => {
  const ctx = useContext(BrowseProductsContext);

  if (typeof ctx === "undefined") {
    throw new Error(
      "useBrowseProductsContext must be used inside BrowseProductsProvider",
    );
  }

  return ctx;
};

export function BrowseProductsProvider({ children }: PropsWithChildren<{}>) {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();
  const [selectedChildProducts, dispatch] = useReducer(
    selectedChildProductsReducer,
    new Map(),
  );
  const [view, setView] = useState<View>("suppliers");

  const selectChildProduct = useCallback(
    (childProduct: ChildProduct, count: number) => {
      dispatch({ type: "add", count, childProduct });
    },
    [],
  );

  const removeChildProduct = useCallback((childProductId: string) => {
    dispatch({ type: "remove", childProductId });
  }, []);

  const updateSelectedCount = useCallback(
    (childProductId: string, count: number) => {
      dispatch({ type: "updateCount", childProductId, count });
    },
    [],
  );

  const totalProductsSelected = useMemo(() => {
    return Array.from(selectedChildProducts.values()).reduce((acc, val) => {
      acc += val.count;
      return acc;
    }, 0);
  }, [selectedChildProducts]);

  return (
    <BrowseProductsContext.Provider
      value={{
        selectedSupplier,
        setSelectedSupplier,
        updateSelectedCount,
        selectChildProduct,
        removeChildProduct,
        selectedChildProducts,
        totalProductsSelected,
        view,
        setView,
      }}
    >
      {children}
    </BrowseProductsContext.Provider>
  );
}
