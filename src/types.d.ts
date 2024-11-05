interface Supplier {
  id: string;
  name: string;
}

interface PurchasePrice {
  price: numver;
  currency: string;
  quantityStart: number;
  quantityEnd: number;
}

interface ChildProduct {
  id: string;
  sku: string;
  name: string;
  purchasePrices: PurchasePrice[];
}

interface Product {
  id: string;
  name: string;
  supplierId: string;
  childProducts: ChildProduct[];
}
