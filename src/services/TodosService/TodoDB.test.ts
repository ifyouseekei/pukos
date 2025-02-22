// import { indexedDB } from 'fake-indexeddb';
import 'fake-indexeddb/auto';
import TodoDB from './TodoDB.js';
import { Todo } from './TodosService.types.js';
import DatabaseService from '../DatabaseService/DatabaseService.js';
import { resetFakeIndexedDB } from '../../utils/testUtils/fakeIndexedDB.utils.js';

global.indexedDB = indexedDB;
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

beforeEach(async () => {
  const todoDB = TodoDB.getInstance();
  await todoDB.initDB();
});
afterEach(async () => {
  const todoDB = TodoDB.getInstance();
  (todoDB as any).instance = null;
  (DatabaseService as any).instance = null;
  resetFakeIndexedDB();
});

describe('TESTING TodoDB add', () => {
  describe('WHEN initializing', () => {
    test('THEN it should successfully create a todo database', async () => {
      const todoDB = TodoDB.getInstance();
      await todoDB.initDB();
      // @ts-expect-error - intentionally accessing private variables
      expect(todoDB.databaseInstance).not.toBeNull();

      // Verify object store and indexes exist
      const dbRequest = indexedDB.open(
        DatabaseService.getInstance().dbName,
        DatabaseService.getInstance().version
      );

      await new Promise<void>((resolve, reject) => {
        dbRequest.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          expect(db.objectStoreNames.contains(TodoDB.storeName)).toBe(true);

          const transaction = db.transaction(TodoDB.storeName, 'readonly');
          const store = transaction.objectStore(TodoDB.storeName);

          expect(store.indexNames.contains('id')).toBe(true);
          expect(store.indexNames.contains('title')).toBe(true);
          expect(store.indexNames.contains('description')).toBe(true);
          expect(store.indexNames.contains('isCompleted')).toBe(true);

          resolve();
        };
        dbRequest.onerror = () => reject(dbRequest.error);
      });
    });
  });

  describe('WHEN adding', () => {
    const todoToAdd = {
      id: 'QWE123',
      title: 'New Todo',
      description: 'Test Description',
      isCompleted: false,
      createdAt: new Date(),
    } satisfies Todo;

    test('THEN it should successfully add a todo', async () => {
      const todoDB = TodoDB.getInstance();
      const [result, error] = await todoDB.add(todoToAdd);
      expect(error).toBeNull();
      expect(result).toBe(todoToAdd);
    });

    test('THEN it should successfully be getById', async () => {
      const todoDB = TodoDB.getInstance();
      await todoDB.add(todoToAdd);

      const [result, error] = await todoDB.getById(todoToAdd.id);
      expect(error).toBeNull();
      expect(result).toStrictEqual(todoToAdd);
    });

    test('THEN it should be included on the getList', async () => {
      const todoDB = TodoDB.getInstance();
      await todoDB.add(todoToAdd);

      const [result, error] = await todoDB.getList({ isCompleted: false });
      expect(error).toBeNull();
      expect(result).toStrictEqual([todoToAdd]);
    });
  });
});

describe('TESTING TodoDB.getList', () => {
  const incompleteTodo = {
    id: '1',
    title: 'Incomplete Todo',
    description: 'Test Description',
    isCompleted: false,
    createdAt: new Date(),
  } satisfies Todo;

  const completeTodo = {
    id: '2',
    title: 'Complete Todo',
    description: 'Test Description',
    isCompleted: true,
    createdAt: new Date(),
  } satisfies Todo;

  describe('WHEN filtering by isCompleted', () => {
    test('THEN it should only return right values', async () => {
      const todoDB = TodoDB.getInstance();
      const [, addIncompletError] = await todoDB.add(incompleteTodo);
      expect(addIncompletError).toBeNull();
      const [, addCompleteError] = await todoDB.add(completeTodo);
      expect(addCompleteError).toBeNull();

      // Should display all
      const [allResult, allError] = await todoDB.getList({});
      expect(allError).toBeNull();
      expect(allResult).toStrictEqual([incompleteTodo, completeTodo]);

      // Should display uncompleted todos
      const [result, error] = await todoDB.getList({ isCompleted: false });
      expect(error).toBeNull();
      expect(result).toStrictEqual([incompleteTodo]);

      // Should display completed todos
      const [result2, error2] = await todoDB.getList({ isCompleted: true });
      expect(error2).toBeNull();
      expect(result2).toStrictEqual([completeTodo]);
    });
  });
});
