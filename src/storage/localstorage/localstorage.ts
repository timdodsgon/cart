import { Store } from '@src/storage/types';
import { Item } from '@src/storage/types';
import { Basket } from '@src/storage/types';
import BasketActions from '@src/storage/basketactions';

export default class LocalStorage<I extends Item, B extends Basket> implements Store<I> {
  private basketActions = new BasketActions<I, B>();
  private emptyBasket: B;

  public constructor(basket?: B) {
    this.emptyBasket = basket || JSON.parse('{ "items": [], "total": 0, "postage": 0 }');
  }

  public add(value: I): boolean {
    try {
      localStorage.setItem('basket', JSON.stringify(this.basketActions.addItem(value, this.getBasket())));
      return true;
    } catch (error) {
      throw new Error('add: unable to add item to basket ' + error);
    }
  }

  public getItems(): Item[] {
    try {
      const basket = this.getBasket();
      return basket.items;
    } catch (error) {
      throw new Error('getItems: unable to retrieve items from basket ' + error);
    }
  }

  public increment(mpn: string, qty: number): boolean {
    try {
      localStorage.setItem('basket', JSON.stringify(this.basketActions.incrementItem(mpn, qty, this.getBasket())));
      return true;
    } catch (error) {
      throw new Error('increment: unable to update item quantity ' + error);
    }
  }

  public decrement(mpn: string, qty: number): boolean {
    try {
      localStorage.setItem('basket', JSON.stringify(this.basketActions.decrementItem(mpn, qty, this.getBasket())));
      return true;
    } catch (error) {
      throw new Error('increment: unable to update item quantity ' + error);
    }
  }

  public remove(mpn: string): boolean {
    try {
      localStorage.setItem('basket', JSON.stringify(this.basketActions.removeItem(mpn, this.getBasket())));
      return true;
    } catch (error) {
      throw new Error('remove: unable to remove item from basket ' + error);
    }
  }

  public clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      throw new Error('clear: unable to clear the basket ' + error);
    }
  }

  private getBasket(): B {
    try {
      return JSON.parse(localStorage.getItem('basket') || JSON.stringify(this.emptyBasket));
    } catch (error) {
      throw new Error('getBasket: unable to retrieve the basket ' + error);
    }
  }
}
