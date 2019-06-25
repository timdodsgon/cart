export interface Store<T> {
  add(value: T): boolean;
  increment(mpn: string, qty: number): boolean;
  decrement(mpn: string, qty: number): boolean;
  remove(mpn: string): boolean;
  getItems(): Item[];
  clear(): boolean;
}

export interface Item {
  mpn: string;
  qty: number;
}

export interface Basket {
  items: Item[];
  total: number;
  postage: number;
}

export interface Product {
  title: string;
  price: number;
  mpn: string;
}
