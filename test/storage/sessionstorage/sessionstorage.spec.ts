import SessionStorage from '@src/storage/sessionstorage/sessionstorage';
import { Item } from '@src/storage/types';
import { Basket } from '@src/storage/types';
import 'jest-localstorage-mock';

function givenItem(price: number, mpn: string, qty: number): Item {
  return {
    price: price,
    mpn: mpn,
    qty: qty,
  };
}

function givenBasket(): Basket {
  return {
    items: [],
    total: 0,
    postage: 0,
  };
}

describe('#BasketActions', (): void => {
  beforeEach((): void => {
    sessionStorage.clear();
  });

  test('Should throw error when value for given key in sessionstorage has invalid JSON strring', (): void => {
    // given
    const sessionstorage = new SessionStorage();
    const item: Item = givenItem(12, '12345', 2);

    sessionStorage.__STORE__['basket'] = item;

    // when
    const addFunction = (): boolean => sessionstorage.add(item);

    // then
    expect(addFunction).toThrowError(
      'Error: getBasket: unable to retrieve the basket SyntaxError: Unexpected token o in JSON at position 1',
    );
  });

  test('Should add item to basket in sessionstorage', (): void => {
    // given
    const storage = new SessionStorage();
    const item: Item = givenItem(10, '12345', 2);

    // when
    const hasItemBeenAddedToBasket: boolean = storage.add(item);

    // then
    expect(hasItemBeenAddedToBasket).toBeTruthy();

    // when
    const basket: Basket = JSON.parse(sessionStorage.__STORE__['basket']);

    // then
    expect(basket.items.length).toEqual(1);
    expect(basket.items[0]).toEqual(item);
    expect(basket.total).toEqual(20);
  });

  test('Should add a custom item with optional property present to basket in sessionstorage', (): void => {
    // given
    const storage = new SessionStorage();
    interface BigItem extends Item {
      image?: string;
    }
    const item: BigItem = { price: 10, mpn: '12345', qty: 2, image: 'url' };

    // when
    const hasItemBeenAddedToBasket: boolean = storage.add(item);

    // then
    expect(hasItemBeenAddedToBasket).toBeTruthy();

    // when
    const basket: Basket = JSON.parse(sessionStorage.__STORE__['basket']);

    // then
    expect(basket.items.length).toEqual(1);
    expect(basket.items[0]).toEqual(item);
    expect(basket.total).toEqual(20);
  });

  test('Should add a custom item with optional property missing to basket in sessionstorage', (): void => {
    // given
    const storage = new SessionStorage();
    interface BigItem extends Item {
      image?: string;
    }
    const item: BigItem = { price: 10, mpn: '12345', qty: 2 };

    // when
    const hasItemBeenAddedToBasket: boolean = storage.add(item);

    // then
    expect(hasItemBeenAddedToBasket).toBeTruthy();

    // when
    const basket: Basket = JSON.parse(sessionStorage.__STORE__['basket']);

    // then
    expect(basket.items.length).toEqual(1);
    expect(basket.items[0]).toEqual(item);
    expect(basket.total).toEqual(20);
  });

  test('Should add item to custom basket with optional property ispresent', (): void => {
    // setup
    interface CustumBasket extends Basket {
      discountCode?: string;
    }

    // given
    let actual: CustumBasket = { items: [], total: 0, postage: 0, discountCode: '' };
    const storage = new SessionStorage(actual);
    const item: Item = givenItem(10, '12345', 2);

    // when
    const hasItemBeenAddedToBasket: boolean = storage.add(item);

    // then
    expect(hasItemBeenAddedToBasket).toBeTruthy();

    // when
    const returned: CustumBasket = JSON.parse(sessionStorage.__STORE__['basket']);

    // then
    expect(returned.items.length).toEqual(1);
    expect(returned.items[0]).toEqual(item);
    expect(returned).toHaveProperty('discountCode');
    expect(returned.total).toEqual(20);
  });

  test('Should add item to custom basket with optional property is missing', (): void => {
    // setup
    interface CustumBasket extends Basket {
      discountCode?: string;
    }

    // given
    let actual: CustumBasket = givenBasket();
    const storage = new SessionStorage(actual);
    const item: Item = givenItem(25.78, '12345', 2);

    // when
    const hasItemBeenAddedToBasket: boolean = storage.add(item);

    // then
    expect(hasItemBeenAddedToBasket).toBeTruthy();

    // when
    const returned: CustumBasket = JSON.parse(sessionStorage.__STORE__['basket']);

    // then
    expect(returned.items.length).toEqual(1);
    expect(returned.items[0]).toEqual(item);
    expect(returned).not.toHaveProperty('discountCode');
    expect(returned.total).toEqual(51.56);
  });

  test('Should return a list of items from basket', (): void => {
    // given
    const storage = new SessionStorage();

    const item1: Item = givenItem(10, '11111', 1);
    const item2: Item = givenItem(12, '22222', 1);

    // when
    const hasItem1BeenAddedToBasket: boolean = storage.add(item1);
    const hasItem2BeenAddedToBasket: boolean = storage.add(item2);

    // then
    expect(hasItem1BeenAddedToBasket).toBeTruthy();
    expect(hasItem2BeenAddedToBasket).toBeTruthy();

    // when
    const returnedItems: Item[] = storage.getItems();

    // then
    expect(returnedItems.length).toEqual(2);
    expect(returnedItems[0]).toEqual(item1);
    expect(returnedItems[1]).toEqual(item2);
  });

  test('Should add two unique items to basket in sessionstorage', (): void => {
    // given
    const storage = new SessionStorage();
    const item1: Item = givenItem(10, '11111', 1);
    const item2: Item = givenItem(12, '22222', 2);

    // when
    const hasItem1BeenAddedToBasket: boolean = storage.add(item1);
    const hasItem2BeenAddedToBasket: boolean = storage.add(item2);

    // then
    expect(hasItem1BeenAddedToBasket).toBeTruthy();
    expect(hasItem2BeenAddedToBasket).toBeTruthy();

    // when
    const basket: Basket = JSON.parse(sessionStorage.__STORE__['basket']);

    // then
    expect(basket.items.length).toEqual(2);
    expect(basket.items[0]).toEqual(item1);
    expect(basket.items[1]).toEqual(item2);
    expect(basket.total).toEqual(34);
  });

  test('Add item should update item quantity if item exists in basket', (): void => {
    // given
    const storage = new SessionStorage();
    const item: Item = givenItem(10, '12345', 2);

    // when
    const hasItem1BeenAddedToBasket: boolean = storage.add(item);
    const hasItem2BeenAddedToBasket: boolean = storage.add(item);

    // then
    expect(hasItem1BeenAddedToBasket).toBeTruthy();
    expect(hasItem2BeenAddedToBasket).toBeTruthy();

    // when
    const basket: Basket = JSON.parse(sessionStorage.__STORE__['basket']);

    // then
    expect(basket.items.length).toEqual(1);
    expect(basket.items[0].qty).toEqual(4);
    expect(basket.total).toEqual(40);
  });

  test('Increment quantity should do nothing when item does not exists in basket', (): void => {
    // given
    const storage = new SessionStorage();

    // when
    const hasItemAttemptedToIncrementedItemInBasket: boolean = storage.increment('11111', 2);

    // then
    expect(hasItemAttemptedToIncrementedItemInBasket).toBeTruthy();

    // when
    const basket: Basket = JSON.parse(sessionStorage.__STORE__['basket']);

    // then
    expect(basket.items.length).toEqual(0);
  });

  test('Increment quantity should add to quanitty when item exists in basket', (): void => {
    // given
    const storage = new SessionStorage();
    const item: Item = givenItem(10, '12345', 2);

    // when
    const hasItem1BeenAddedToBasket: boolean = storage.add(item);
    const hasItemIncrementedInBasket: boolean = storage.increment('12345', 2);

    // then
    expect(hasItem1BeenAddedToBasket).toBeTruthy();
    expect(hasItemIncrementedInBasket).toBeTruthy();

    // when
    const basket: Basket = JSON.parse(sessionStorage.__STORE__['basket']);

    // then
    expect(basket.items.length).toEqual(1);
    expect(basket.items[0].qty).toEqual(4);
    expect(basket.total).toEqual(40);
  });

  test('Decrement quantity should subtract from item quantity when item exists in basket and quanitity to remove is > 1', (): void => {
    // given
    const storage = new SessionStorage();
    const item: Item = givenItem(23.67, '12345', 4);

    // when
    const hasItem1BeenAddedToBasket: boolean = storage.add(item);
    const hasItemIncrementedInBasket: boolean = storage.decrement('12345', 2);

    // then
    expect(hasItem1BeenAddedToBasket).toBeTruthy();
    expect(hasItemIncrementedInBasket).toBeTruthy();

    // when
    const basket: Basket = JSON.parse(sessionStorage.__STORE__['basket']);

    // then
    expect(basket.items.length).toEqual(1);
    expect(basket.items[0].qty).toEqual(2);
    expect(basket.total).toEqual(47.34);
  });

  test('Decrement quantity should do nothing when item exists in basket and item quanitity is <= than the quantity to remove', (): void => {
    // given
    const storage = new SessionStorage();
    const item: Item = givenItem(29.78, '12345', 4);

    // when
    expect(storage.add(item)).toBeTruthy();
    expect(storage.decrement('12345', 4)).toBeTruthy();

    // then
    const basket: Basket = JSON.parse(sessionStorage.__STORE__['basket']);
    expect(basket.items.length).toEqual(1);
    expect(basket.items[0].qty).toEqual(4);
    expect(basket.total).toEqual(119.12);
  });

  test('Remove given item from basket', (): void => {
    // given
    const storage = new SessionStorage();
    const item: Item = givenItem(21.45, '12345', 4);

    // when
    const hasItemBeenAddedToBasket: boolean = storage.add(item);

    // then
    expect(hasItemBeenAddedToBasket).toBeTruthy();

    // when
    const basket: Basket = JSON.parse(sessionStorage.__STORE__['basket']);

    // then
    expect(basket.items.length).toEqual(1);

    // when
    expect(storage.remove(item.mpn)).toBeTruthy();

    // then
    const updatedBasket: Basket = JSON.parse(sessionStorage.__STORE__['basket']);
    expect(updatedBasket.items.length).toEqual(0);
    expect(basket.total).toEqual(85.8);
  });

  test('Clear basket', (): void => {
    // given
    const storage = new SessionStorage();
    const item: Item = givenItem(10, '11111', 4);

    // when
    const hasItemBeenAddedToBasket: boolean = storage.add(item);

    // then
    expect(hasItemBeenAddedToBasket).toBeTruthy();

    // when
    const basket: Basket = JSON.parse(sessionStorage.__STORE__['basket']);

    // then
    expect(basket.items.length).toEqual(1);

    // when
    const isBasketClear: boolean = storage.clear();

    // then
    expect(isBasketClear).toBeTruthy();
    expect((): void => {
      JSON.parse(sessionStorage.__STORE__['basket']);
    }).toThrowError('Unexpected token u in JSON at position 0');
    expect(basket.total).toEqual(40);
  });
});
