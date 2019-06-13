import { Item } from "./types";
import { Basket } from "./types";

export default class BasketActions {

    /**
     * Add a unique item to the basket or update the quantity of the item if it already exsists
     *
     * @param Item
     * @param Basket
     * @returns {Basket}
     * @protected
     */
    protected addItem(value: Item, basket: Basket): Basket {
        if(this.isItemInBasket(value, basket)) { 
            return this.incrementItem(value.mpn, value.qty, basket); 
        }
        basket.items.push(value);
        return basket;
    }

    /**
     * Increment the quantity of a given item in the basket
     *
     * @param string
     * @param number
     * @param Basket
     * @returns {Basket}
     * @protected
     */
    protected incrementItem(mpn: string, qty: number, basket: Basket): Basket {
        basket.items.forEach((item: Item) => {
            (mpn === item.mpn) ? item.qty += qty : null;
        });
        return basket;
    }

    /**
     * Decrement the quantity of a given item in the basket
     *
     * @param string
     * @param number
     * @param Basket
     * @returns {Basket}
     * @protected
     */
    protected decrementItem(mpn: string, qty: number, basket: Basket): Basket {
        basket.items.forEach((item: Item) => {
            (mpn === item.mpn && item.qty > qty) ? item.qty -= qty : null;
        });
        return basket;
    }

    /**
     * Remove given item from the basket
     *
     * @param string
     * @param Basket
     * @returns {Basket}
     * @protected
     */
    protected removeItem(mpn: string, basket: Basket): Basket {
        let updatedBasket: Basket = { items: [], total: 0, postage: 0 };
        updatedBasket.items = basket.items.filter((item: Item) => {
            return item.mpn !== mpn;
        });
        return updatedBasket;
    }

    /**
     * Check if an item is present in the basket
     *
     * @param Item
     * @param Basket
     * @returns {boolean}
     * @protected
     */
    protected isItemInBasket(value: Item, basket: Basket): boolean {
        return basket.items.some((item: Item) => {
            return item.mpn === value.mpn;
        });
    }
}