import { IDBFactory } from 'fake-indexeddb';

export async function resetFakeIndexedDB() {
  indexedDB = new IDBFactory();
}
