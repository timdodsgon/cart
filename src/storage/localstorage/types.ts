export interface Item {
    title: string;
    price: number;
    mpn: string;
    qty: number;
}

export interface Store<T, R> {
    add(value: T): R;
    increment(mpn: string, qty: number): R;
    decrement(mpn: string, qty: number): R;
    remove(mpn: string): R
    clear(): R;
}

export interface Basket {
    items: Item[];
    total: number;
    postage: number;
}
