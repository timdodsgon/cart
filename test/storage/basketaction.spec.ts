import BasketActions from "@src/storage/basketactions";
import { Item } from "@src/storage/types";
import { Basket } from "@src/storage/types";

describe("#BasketActions", () => {

    test("Should add item to empty basket", () => {
        // given
        const basketActions = new BasketActions<Item, Basket>();
        const item: Item = givenItem("123345", 2);
        let basket: Basket = givenBasket();
  
        // when
        basket = basketActions.addItem(item, basket);
        
        // then
        expect(basket.items.length).toEqual(1);
    })

    test("Should add two unique items to empty basket", () => {
        // given
        const basketActions = new BasketActions<Item, Basket>();
        const item1: Item = givenItem("11111", 2);
        const item2: Item = givenItem("22222", 2);
        let basket: Basket = givenBasket();
  
        // when
        basket = basketActions.addItem(item1, basket);
        basket = basketActions.addItem(item2, basket);
        
        // then
        expect(basket.items.length).toEqual(2);
    })

    test("Should update quanity when added item alraedy exsits in basket", () => {
        // given
        const basketActions = new BasketActions<Item, Basket>();
        const item1: Item = givenItem("11111", 2);
        const item2: Item = givenItem("11111", 2);
        let basket: Basket = givenBasket();
  
        // when
        basket = basketActions.addItem(item1, basket);
        basket = basketActions.addItem(item2, basket);
        
        // then
        expect(basket.items.length).toEqual(1);
    }) 

    test("Should increment quantity of given item in the basket", () => {
        // given
        const basketActions = new BasketActions<Item, Basket>();
        const item: Item = givenItem("11111", 2);
        let basket: Basket = givenBasket();
  
        // when
        basket = basketActions.addItem(item, basket);
        basket = basketActions.incrementItem("11111", 2, basket);
        
        // then
        expect(basket.items.length).toEqual(1);
        expect(basket.items[0].qty).toEqual(4);
    }) 

    test("Should do nothing when increment quantity of a item when the basket is empty", () => {
        // given
        const basketActions = new BasketActions<Item, Basket>();
        let basket: Basket = givenBasket();
  
        // when
        basket = basketActions.incrementItem("11111", 2, basket);
        
        // then
        expect(basket.items.length).toEqual(0);
    }) 

    test("Should decrement quantity of given item in the basket", () => {
        // given
        const basketActions = new BasketActions<Item, Basket>();
        const item: Item = givenItem("11111", 2);
        let basket: Basket = givenBasket();
  
        // when
        basket = basketActions.addItem(item, basket);
        basket = basketActions.decrementItem("11111", 1, basket);
        
        // then
        expect(basket.items.length).toEqual(1);
        expect(basket.items[0].qty).toEqual(1);
    }) 

    test("Should do nothing when decrement quantity of a item when the basket is empty", () => {
        // given
        const basketActions = new BasketActions<Item, Basket>();
        let basket: Basket = givenBasket();
  
        // when
        basket = basketActions.decrementItem("11111", 2, basket);
        
        // then
        expect(basket.items.length).toEqual(0);
    })

    test("Should remove exsisting item from basket", () => {
        // given
        const basketActions = new BasketActions<Item, Basket>();
        const item: Item = givenItem("11111", 2);
        let basket: Basket = givenBasket();
  
        // when
        basket = basketActions.addItem(item, basket);
        basket = basketActions.removeItem("11111", basket);
        
        // then
        expect(basket.items.length).toEqual(0);
    })

    test("Should do nothing when removing item from empty basket", () => {
        // given
        const basketActions = new BasketActions<Item, Basket>();
        let basket: Basket = givenBasket();
  
        // when
        basket = basketActions.removeItem("11111", basket);
        
        // then
        expect(basket.items.length).toEqual(0);
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

