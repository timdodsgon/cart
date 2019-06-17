import LocalStorage from "@src/storage/localstorage/localstorage";
import { Item } from "@src/storage/types";
import { Basket } from "@src/storage/types";
import 'jest-localstorage-mock';

describe("#BasketActions", () => {

    beforeEach(() => {
        localStorage.clear();
    });

    test("Should throw error when value for given key in localstorage has invalid JSON strring", () => {
        // given
        const localstorage = new LocalStorage();
        const item: Item = givenItem("12345", 2);
            
        localStorage.__STORE__["basket"] = item;
  
        // when
        const addFunction = () => localstorage.add(item);
        
        // then
        expect(addFunction).toThrowError("Error: getBasket: unable to retrieve the basket SyntaxError: Unexpected token o in JSON at position 1");
    })

    test("Should add item to basket in localstorage", () => {
        // given
        const storage = new LocalStorage();
        const item: Item = givenItem("12345", 2);
                             
        // when
        const hasItemBeenAddedToBasket: boolean = storage.add(item);

        // then
        expect(hasItemBeenAddedToBasket).toBeTruthy();

        // when
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);

        // then
        expect(basket.items.length).toEqual(1);
        expect(basket.items[0]).toEqual(item);
    })

    test("Should add a custom item with optional property present to basket in localstorage", () => {
        // given
        const storage = new LocalStorage();
        interface BigItem extends Item {
            image?: string;
        }
        const item: BigItem = { mpn: "12345",
                                qty: 2,
                                image: "url" }
                             
        // when
        const hasItemBeenAddedToBasket: boolean = storage.add(item);

        // then
        expect(hasItemBeenAddedToBasket).toBeTruthy();

        // when
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);

        // then
        expect(basket.items.length).toEqual(1);
        expect(basket.items[0]).toEqual(item);
    })

    test("Should add a custom item with optional property missing to basket in localstorage", () => {
        // given
        const storage = new LocalStorage();
        interface BigItem extends Item {
            image?: string;
        }
        const item: BigItem = { mpn: "12345",
                                qty: 2 }
                             
        // when
        const hasItemBeenAddedToBasket: boolean = storage.add(item);

        // then
        expect(hasItemBeenAddedToBasket).toBeTruthy();

        // when
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);

        // then
        expect(basket.items.length).toEqual(1);
        expect(basket.items[0]).toEqual(item);
    })

    test("Should add item to custom basket with optional property ispresent", () => {
        // setup
        interface CustumBasket extends Basket {
            discountCode?: string;
        }
        
        // given
        let actual: CustumBasket = { items: [],
                                     total: 0,
                                     postage: 0,
                                     discountCode: "" };
        const storage = new LocalStorage(actual);
        const item: Item = givenItem("12345", 2);
                             
        // when
        const hasItemBeenAddedToBasket: boolean = storage.add(item);

        // then
        expect(hasItemBeenAddedToBasket).toBeTruthy();

        // when
        const returned: CustumBasket = JSON.parse(localStorage.__STORE__["basket"]);

        // then
        expect(returned.items.length).toEqual(1);
        expect(returned.items[0]).toEqual(item);
        expect(returned).toHaveProperty('discountCode')
    })

    test("Should add item to custom basket with optional property is missing", () => {
        // setup
        interface CustumBasket extends Basket {
            discountCode?: string;
        }
        
        // given
        let actual: CustumBasket = givenBasket();
        const storage = new LocalStorage(actual);
        const item: Item = givenItem("12345", 2);
                             
        // when
        const hasItemBeenAddedToBasket: boolean = storage.add(item);

        // then
        expect(hasItemBeenAddedToBasket).toBeTruthy();

        // when
        const returned: CustumBasket = JSON.parse(localStorage.__STORE__["basket"]);

        // then
        expect(returned.items.length).toEqual(1);
        expect(returned.items[0]).toEqual(item);
        expect(returned).not.toHaveProperty('discountCode')
    })

    test("Should return a list of items from basket", () => {
        // given
        const storage = new LocalStorage();

        const item1: Item = givenItem("11111", 1);
        const item2: Item = givenItem("22222", 1);
                             
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
    })

    test("Should add two unique items to basket in localstorage", () => {
        // given
        const storage = new LocalStorage();
        const item1: Item = givenItem("11111", 1);
        const item2: Item = givenItem("22222", 2);
                             
        // when
        const hasItem1BeenAddedToBasket: boolean = storage.add(item1);
        const hasItem2BeenAddedToBasket: boolean = storage.add(item2);

        // then
        expect(hasItem1BeenAddedToBasket).toBeTruthy();
        expect(hasItem2BeenAddedToBasket).toBeTruthy();

        // when
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);

        // then
        expect(basket.items.length).toEqual(2);
        expect(basket.items[0]).toEqual(item1);
        expect(basket.items[1]).toEqual(item2);
    })

    test("Add item should update item quantity if item exists in basket", () => {
        // given
        const storage = new LocalStorage();
        const item: Item = givenItem("12345", 2);
                             
        // when
        const hasItem1BeenAddedToBasket: boolean = storage.add(item);
        const hasItem2BeenAddedToBasket: boolean = storage.add(item);

        // then
        expect(hasItem1BeenAddedToBasket).toBeTruthy();
        expect(hasItem2BeenAddedToBasket).toBeTruthy();

        // when
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);

        // then
        expect(basket.items.length).toEqual(1);
        expect(basket.items[0].qty).toEqual(4);
    })

    test("Increment quantity should do nothing when item does not exists in basket", () => {
        // given
        const storage = new LocalStorage();
                             
        // when
        const hasItemAttemptedToIncrementedItemInBasket: boolean = storage.increment("11111", 2)

        // then
        expect(hasItemAttemptedToIncrementedItemInBasket).toBeTruthy();

        // when
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);

        // then
        expect(basket.items.length).toEqual(0);
    })

    test("Increment quantity should add to quanitty when item exists in basket", () => {
        // given
        const storage = new LocalStorage();
        const item: Item = givenItem("12345", 2);
                             
        // when
        const hasItem1BeenAddedToBasket: boolean = storage.add(item);
        const hasItemIncrementedInBasket: boolean = storage.increment("12345", 2)

        // then
        expect(hasItem1BeenAddedToBasket).toBeTruthy();
        expect(hasItemIncrementedInBasket).toBeTruthy();

        // when
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);

        // then
        expect(basket.items.length).toEqual(1);
        expect(basket.items[0].qty).toEqual(4);
    })

    test("Decrement quantity should subtract from item quantity when item exists in basket and quanitity to remove is > 1", () => {
        // given
        const storage = new LocalStorage();
        const item: Item = givenItem("12345", 4);
                             
        // when
        const hasItem1BeenAddedToBasket: boolean = storage.add(item);
        const hasItemIncrementedInBasket: boolean = storage.decrement("12345", 2)

        // then
        expect(hasItem1BeenAddedToBasket).toBeTruthy();
        expect(hasItemIncrementedInBasket).toBeTruthy();

        // when
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);

        // then
        expect(basket.items.length).toEqual(1);
        expect(basket.items[0].qty).toEqual(2);
    })

    test("Decrement quantity should do nothing when item exists in basket and item quanitity is <= than the quantity to remove", () => {
        // given
        const storage = new LocalStorage();
        const item: Item = givenItem("12345", 4);
                             
        // when
        expect(storage.add(item)).toBeTruthy();
        expect(storage.decrement("12345", 4)).toBeTruthy();

        // then
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);
        expect(basket.items.length).toEqual(1);
        expect(basket.items[0].qty).toEqual(4);
    })

    test("Remove given item from basket", () => {
        // given
        const storage = new LocalStorage();
        const item: Item = givenItem("12345", 4);
                             
        // when
        const hasItemBeenAddedToBasket: boolean = storage.add(item);

        // then
        expect(hasItemBeenAddedToBasket).toBeTruthy();

        // when
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);

        // then
        expect(basket.items.length).toEqual(1);

        // when
        expect(storage.remove(item.mpn)).toBeTruthy();

        // then
        const updatedBasket: Basket = JSON.parse(localStorage.__STORE__["basket"]);
        expect(updatedBasket.items.length).toEqual(0);
    })

    test("Clear basket", () => {
        // given
        const storage = new LocalStorage();
        const item: Item = givenItem("11111", 4);
                             
        // when
        const hasItemBeenAddedToBasket: boolean = storage.add(item)

        // then
        expect(hasItemBeenAddedToBasket).toBeTruthy();

        // when
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);

        // then
        expect(basket.items.length).toEqual(1);

        // when
        const isBasketClear: boolean = storage.clear();

        // then
        expect(isBasketClear).toBeTruthy();
        expect(() => {
            JSON.parse(localStorage.__STORE__["basket"]);
          }).toThrowError("Unexpected token u in JSON at position 0");
    })
})

function givenItem(mpn: string, qty: number): Item {
    return {
        mpn: mpn,
        qty: qty
    };
}

function givenBasket(): Basket{
    return {
        items: [],
        total: 0,
        postage: 0
    };
}
