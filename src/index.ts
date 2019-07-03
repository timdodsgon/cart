import { Item } from '@src/storage/types';
import { Basket } from '@src/storage/types';
import LocalStorage from '@src/storage/localstorage/localstorage';

export interface BigItem extends Item {
  image?: string;
}

export interface BigBasket extends Basket {
  returns?: string;
}

const item: BigItem = { price: 10, mpn: '11111', qty: 1, image: 'url' };

const basket: BigBasket = { items: [], total: 0, postage: 0, returns: '' };

const storage = new LocalStorage<BigItem, BigBasket>(basket);
storage.add(item);
storage.increment(item.mpn, 3);
storage.increment(item.mpn, 1);
storage.decrement(item.mpn, 1);
storage.remove(item.mpn);
storage.clear();
