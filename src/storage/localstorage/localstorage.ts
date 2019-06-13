import { Store } from "./types";
import { Item } from "./types";
import { Basket } from "./types";
import BasketActions from "./basketactions";

export default class LocalStorage extends BasketActions implements Store<Item, boolean> {

    add(value: Item): boolean {
        try{
            localStorage.setItem("basket", JSON.stringify(super.addItem(value, this.getBasket())));
            return true;
        } catch(error) {
            throw new Error("add: unable to add item to basket " + error);
        }
    }    
    
    increment(mpn: string, qty: number): boolean {
        try{
            localStorage.setItem("basket", JSON.stringify(super.incrementItem(mpn, qty, this.getBasket())));
            return true;
        } catch(error) {
            throw new Error("increment: unable to update item quantity " + error);
        }
    }

    decrement(mpn: string, qty: number): boolean {
        try{
            localStorage.setItem("basket", JSON.stringify(super.decrementItem(mpn, qty, this.getBasket())));
            return true;
        } catch(error) {
            throw new Error("increment: unable to update item quantity " + error);
        }
    }

    remove(mpn: string): boolean {
        try{
            localStorage.setItem("basket", JSON.stringify(super.removeItem(mpn, this.getBasket())));
            return true;
        } catch(error) {
            throw new Error("remove: unable to remove item from basket " + error);
        }
    }

    clear(): boolean {
        try{
            localStorage.clear();
            return true;
        } catch(error) {
            throw new Error("clear: unable to clear the basket " + error);
        }
    } 

    private getBasket(): Basket {
        const EMPTY_BASKET: string = "{ \"items\": [], \"total\": 0, \"postage\": 0 }";
        return JSON.parse(localStorage.getItem("basket") || EMPTY_BASKET); 
    }
}