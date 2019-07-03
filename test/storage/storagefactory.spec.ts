import StorageFactory from '@src/storage/storagefactory';
import { Item } from '@src/storage/types';
import { Basket } from '@src/storage/types';
import LocalStorage from '@src/storage/localstorage/localstorage';
import SessionStorage from '@src/storage/sessionstorage/sessionstorage';

describe('#Storagefactory', (): void => {
  test('Should create storage object of type localstorage', (): void => {
    // given
    const storageFactory = new StorageFactory<Item, Basket>();

    // when
    const storage = storageFactory.createStorage('localstorage');

    // then
    expect(storage).toBeInstanceOf(LocalStorage);
    expect(storage).not.toBeInstanceOf(SessionStorage);
  });

  test('Should create storage object of type localstorage with custom item type', (): void => {
    // given
    interface CustomItem extends Item {
      image?: string;
    }
    const storageFactory = new StorageFactory<CustomItem, Basket>();

    // when
    const storage = storageFactory.createStorage('localstorage');

    // then
    expect(storage).toBeInstanceOf(LocalStorage);
    expect(storage).not.toBeInstanceOf(SessionStorage);
  });

  test('Should create storage object of type localstorage with custom basket type', (): void => {
    // given
    interface CustomBasket extends Basket {
      returns?: string;
    }
    const storageFactory = new StorageFactory<Item, CustomBasket>();

    // when
    const storage = storageFactory.createStorage('localstorage');

    // then
    expect(storage).toBeInstanceOf(LocalStorage);
    expect(storage).not.toBeInstanceOf(SessionStorage);
  });

  test('Should create storage object of type sessionstorage', (): void => {
    // given
    const storageFactory = new StorageFactory<Item, Basket>();

    // when
    const storage = storageFactory.createStorage('sessionstorage');

    // then
    expect(storage).toBeInstanceOf(SessionStorage);
    expect(storage).not.toBeInstanceOf(LocalStorage);
  });

  test('Should create storage object of type sessionstorage with custom item type', (): void => {
    // given
    interface CustomItem extends Item {
      image?: string;
    }
    const storageFactory = new StorageFactory<CustomItem, Basket>();

    // when
    const storage = storageFactory.createStorage('sessionstorage');

    // then
    expect(storage).toBeInstanceOf(SessionStorage);
    expect(storage).not.toBeInstanceOf(LocalStorage);
  });

  test('Should create storage object of type sessionstorage with custom basket type', (): void => {
    // given
    interface CustomBasket extends Basket {
      returns?: string;
    }
    const storageFactory = new StorageFactory<Item, CustomBasket>();

    // when
    const storage = storageFactory.createStorage('sessionstorage');

    // then
    expect(storage).toBeInstanceOf(SessionStorage);
    expect(storage).not.toBeInstanceOf(LocalStorage);
  });
});
