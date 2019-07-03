import { Item } from '@src/storage/types';
import { Basket } from '@src/storage/types';

export default class BasketActions<I extends Item, B extends Basket> {
  /**
   * Add a unique item to the basket or update the quantity of the item if it already exsists
   */
  public addItem(value: I, basket: B): B {
    if (this.isItemInBasket(value, basket)) {
      return this.incrementItem(value.mpn, value.qty, basket);
    }
    basket.items.push(value);
    return this.recalculateBasketTotal(basket);
  }

  /**
   * Increment the quantity of a given item in the basket
   */
  public incrementItem(mpn: string, qty: number, basket: B): B {
    basket.items.forEach((item): number => (mpn === item.mpn ? (item.qty += qty) : 0));
    return this.recalculateBasketTotal(basket);
  }

  /**
   * Decrement the quantity of a given item in the basket
   */
  public decrementItem(mpn: string, qty: number, basket: B): B {
    basket.items.forEach((item): number => (mpn === item.mpn && item.qty > qty ? (item.qty -= qty) : 0));
    return this.recalculateBasketTotal(basket);
  }

  /**
   * Remove given item from the basket
   */
  public removeItem(mpn: string, basket: B): B {
    basket.items = basket.items.filter((item): boolean => item.mpn !== mpn);
    return this.recalculateBasketTotal(basket);
  }

  /**
   * Check if an item is present in the basket
   */
  private isItemInBasket(value: I, basket: B): boolean {
    return basket.items.some((item): boolean => item.mpn === value.mpn);
  }

  /**
   * Recalculate total of all items in the basket
   */
  private recalculateBasketTotal(basket: B): B {
    basket.total = 0;
    basket.items.forEach((item): number => (basket.total += item.price * item.qty));
    return basket;
  }
}
