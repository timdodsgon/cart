import SessionStorage from '@src/storage/sessionstorage/sessionstorage';
import LocalStorage from '@src/storage/localstorage/localstorage';

import { Item } from '@src/storage/types';
import { Basket } from '@src/storage/types';

export default class StorageFactory<I extends Item, B extends Basket> {
  public createStorage(type: string, basket?: B): LocalStorage<I, B> | SessionStorage<I, B> {
    if (type === 'localstorage') {
      return new LocalStorage<I, B>(basket);
    } else if (type === 'sessionstorage') {
      return new SessionStorage<I, B>(basket);
    } 
    throw new Error('Select a valid storage type ' + type);
  }
}
