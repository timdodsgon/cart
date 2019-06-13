// Why have you not setup aliasing?
import LocalStorage from "../../../src/storage/localstorage/localstorage";
import { Item } from "../../../src/storage/localstorage/types";
import { Basket } from "../../../src/storage/localstorage/types";
import 'jest-localstorage-mock';

describe("#LocalStorage", () => {

    beforeEach(() => {
        localStorage.clear();
    });

    test("Should throw error when value for given key in localstorage has invalid JSON strring", () => {
        // given
        const localstorage = new LocalStorage();
        const item: Item = { title: "test",
                             price: 100,
                             mpn: "12345",
                             qty: 2 };
            
        localStorage.__STORE__["basket"] = item;
  
        // then
        expect(() => {
            localstorage.add(item);
          }).toThrow("add: unable to add item to basket SyntaxError: Unexpected token o in JSON at position 1");
    })

    test("Should add item to basket in localstorage", () => {
        // given
        const localstorage = new LocalStorage();
        const item: Item = { title: "test",
                             price: 100,
                             mpn: "12345",
                             qty: 2 }
                             
        // when
        expect(localstorage.add(item)).toBeTruthy();

        // then
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);
        expect(basket.items.length).toEqual(1);
        expectItemsToBeEqual(basket.items[0], item);
    })

    test("Should add two unique items to basket in localstorage", () => {
        // given
        const localstorage = new LocalStorage();
        const item1: Item = { title: "test1",
                             price: 10,
                             mpn: "11111",
                             qty: 1 }

        const item2: Item = { title: "test2",
                             price: 20,
                             mpn: "22222",
                             qty: 2 }
                             
        // when
        expect(localstorage.add(item1)).toBeTruthy();
        expect(localstorage.add(item2)).toBeTruthy();

        // then
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);
        expect(basket.items.length).toEqual(2);
        expectItemsToBeEqual(basket.items[0], item1);
        expectItemsToBeEqual(basket.items[1], item2);
    })

    test("Add item should update item quantity if item exists in basket", () => {
        // given
        const localstorage = new LocalStorage();
        const item: Item = { title: "test",
                             price: 100,
                             mpn: "12345",
                             qty: 2 }
                             
        // when
        expect(localstorage.add(item)).toBeTruthy();
        expect(localstorage.add(item)).toBeTruthy();

        // then
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);
        expect(basket.items.length).toEqual(1);
        expect(basket.items[0].qty).toEqual(4);
    })

    test("Increment quantity should do nothing when item does not exists in basket", () => {
        // given
        const localstorage = new LocalStorage();
                             
        // when
        expect(localstorage.increment("11111", 2)).toBeTruthy();

        // then
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);
        expect(basket.items.length).toEqual(0);
    })

    test("Increment quantity should add to quanitty when item exists in basket", () => {
        // given
        const localstorage = new LocalStorage();
        const item: Item = { title: "test",
                             price: 100,
                             mpn: "12345",
                             qty: 2 }
                             
        // when
        expect(localstorage.add(item)).toBeTruthy();
        expect(localstorage.increment("12345", 2)).toBeTruthy();

        // then
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);
        expect(basket.items.length).toEqual(1);
        expect(basket.items[0].qty).toEqual(4);
    })

    test("Decrement quantity should subtract from item quantity when item exists in basket and quanitity to remove is > 1", () => {
        // given
        const localstorage = new LocalStorage();
        const item: Item = { title: "test",
                             price: 100,
                             mpn: "12345",
                             qty: 4 }
                             
        // when
        expect(localstorage.add(item)).toBeTruthy();
        expect(localstorage.decrement("12345", 2)).toBeTruthy();

        // then
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);
        expect(basket.items.length).toEqual(1);
        expect(basket.items[0].qty).toEqual(2);
    })

    test("Decrement quantity should do nothing when item exists in basket and item quanitity is <= than the quantity to remove", () => {
        // given
        const localstorage = new LocalStorage();
        const item: Item = { title: "test",
                             price: 100,
                             mpn: "12345",
                             qty: 4 }
                             
        // when
        expect(localstorage.add(item)).toBeTruthy();
        expect(localstorage.decrement("12345", 4)).toBeTruthy();

        // then
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);
        expect(basket.items.length).toEqual(1);
        expect(basket.items[0].qty).toEqual(4);
    })

    test("Remove given item from basket", () => {
        // given
        const localstorage = new LocalStorage();
        const item: Item = { title: "test",
                             price: 100,
                             mpn: "12345",
                             qty: 4 }
                             
        // when
        expect(localstorage.add(item)).toBeTruthy();

        // then
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);
        expect(basket.items.length).toEqual(1);

        // when
        expect(localstorage.remove(item.mpn)).toBeTruthy();

        // then
        const updatedBasket: Basket = JSON.parse(localStorage.__STORE__["basket"]);
        expect(updatedBasket.items.length).toEqual(0);
    })

    test("Clear basket", () => {
        // given
        const localstorage = new LocalStorage();
        const item: Item = { title: "test",
                             price: 100,
                             mpn: "12345",
                             qty: 4 }
                             
        // when
        expect(localstorage.add(item)).toBeTruthy();

        // then
        const basket: Basket = JSON.parse(localStorage.__STORE__["basket"]);
        expect(basket.items.length).toEqual(1);

        // when
        expect(localstorage.clear()).toBeTruthy();

        // then
        expect(() => {
            JSON.parse(localStorage.__STORE__["basket"]);
          }).toThrow("Unexpected token u in JSON at position 0");
    })
})

function expectItemsToBeEqual(result: Item, actual: Item): void {
    expect(result).toEqual(actual);
}
