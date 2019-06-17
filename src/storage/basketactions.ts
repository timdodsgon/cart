import { Item } from "@src/storage/types";
import { Basket } from "@src/storage/types";

export default class BasketActions<I extends Item, B extends Basket> {

    /**
     * Add a unique item to the basket or update the quantity of the item if it already exsists
     */
    addItem(value: I, basket: B): B {
        if(this.isItemInBasket(value, basket)) { 
            return this.incrementItem(value.mpn, value.qty, basket); 
        }
        basket.items.push(value);
        return basket;
    }

    /**
     * Increment the quantity of a given item in the basket
     */
    incrementItem(mpn: string, qty: number, basket: B): B{
        basket.items.forEach((item) => {
            (mpn === item.mpn) ? item.qty += qty : null;
        });
        return basket;
    }

    /**
     * Decrement the quantity of a given item in the basket
     */
    decrementItem(mpn: string, qty: number, basket: B): B {
        basket.items.forEach((item) => {
            (mpn === item.mpn && item.qty > qty) ? item.qty -= qty : null;
        });
        return basket;
    }

    /**
     * Remove given item from the basket
     */
    removeItem(mpn: string, basket: B): B {
        basket.items = basket.items.filter((item) => {
            return item.mpn !== mpn;
        });
        return basket;
    }

    /**
     * Check if an item is present in the basket
     */
    private isItemInBasket(value: I, basket: B): boolean {
        return basket.items.some((item) => {
            return item.mpn === value.mpn;
        });
    }
}