import DatabaseService from '../DatabaseService/DatabaseService';
import { toDatabase, toTodo } from './TodoDB.transformers';
import { Todo, TodoInDB } from './TodosService.types';

class TodoDB {
  private static instance: TodoDB | null = null;

  public static storeName = 'todos';
  private databaseService: DatabaseService;

  private constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  /**
   * Initializa DB and set its user store
   */
  async initDB(): Promise<void> {
    const [, error] = await this.databaseService.connect(this.createStore);
    if (error !== null) {
      throw error;
    }
  }

  private createStore(db: IDBDatabase) {
    if (db.objectStoreNames.contains(TodoDB.storeName)) {
      return;
    }

    const objectStore = db.createObjectStore(TodoDB.storeName, {
      autoIncrement: true,
      keyPath: 'id',
    });

    // Create an index to search todos.
    objectStore.createIndex('id', 'id', { unique: true });

    // We may have duplicates
    // so we can't use a unique index.
    objectStore.createIndex('title', 'title', { unique: false });
    objectStore.createIndex('isCompleted', 'isCompleted', {
      unique: false,
    });
    objectStore.createIndex('description', 'description', {
      unique: false,
    });
  }

  /**
   * Add a todo
   */
  public add(todo: Todo): Promise<AppResponseType<Todo>> {
    return new Promise((resolve) => {
      if (!this.databaseService) {
        return resolve([null, new Error('no database found')]);
      }

      const [objectStore, error] = this.databaseService.getObjectStore(
        TodoDB.storeName,
        'readwrite'
      );
      if (error) {
        return resolve([null, error]);
      }

      const request = objectStore.add(toDatabase(todo));
      request.onsuccess = () => resolve([todo, null]);
      request.onerror = () => resolve([null, new Error('failed to save todo')]);
    });
  }

  public deleteById(id: Todo['id']): Promise<Error | null> {
    return new Promise((resolve) => {
      if (!this.databaseService) {
        return resolve(new Error('no database found'));
      }

      const [objectStore, error] = this.databaseService.getObjectStore(
        TodoDB.storeName,
        'readwrite'
      );

      if (error) {
        return resolve(error);
      }

      const request = objectStore.delete(id);
      request.onsuccess = () => resolve(null);
      request.onerror = () => resolve(new Error('failed to save todo'));
    });
  }

  public update(todo: Todo): Promise<AppResponseType<Todo>> {
    return new Promise((resolve) => {
      if (!this.databaseService) {
        return resolve([null, new Error('no database found')]);
      }

      const [objectStore, error] = this.databaseService.getObjectStore(
        TodoDB.storeName,
        'readwrite'
      );

      if (error) {
        return resolve([null, error]);
      }

      const request = objectStore.put(toDatabase(todo));
      request.onsuccess = () => resolve([todo, null]);
      request.onerror = () => resolve([null, new Error('failed to save todo')]);
    });
  }

  /**
   * Get a Todo by its ID
   */
  public getById(id: Todo['id']): Promise<AppResponseType<Todo>> {
    return new Promise((resolve) => {
      if (!this.databaseService) {
        return resolve([null, new Error('no database found')]);
      }

      const [objectStore, error] = this.databaseService.getObjectStore(
        TodoDB.storeName,
        'readwrite'
      );

      if (error) {
        return resolve([null, error]);
      }

      const request = objectStore.get(id);
      request.onsuccess = () => {
        if (!TodoDB.isTodo(request.result)) {
          return resolve([null, new Error('the returned value is not a todo')]);
        }
        return resolve([toTodo(request.result), null]);
      };
      request.onerror = () => resolve([null, new Error('failed to save todo')]);
    });
  }

  /**
   * Get all todos that are not yet completed
   * This will be mainly used for displaying current todos
   */
  public getList({
    isCompleted,
  }: {
    isCompleted?: boolean;
  }): Promise<AppResponseType<Todo[]>> {
    return new Promise((resolve) => {
      if (!this.databaseService) {
        return resolve([null, new Error('no database found')]);
      }

      const [objectStore, error] = this.databaseService.getObjectStore(
        TodoDB.storeName,
        'readwrite'
      );

      if (error) {
        return resolve([null, error]);
      }

      let getAllRequest: IDBRequest<any[]>;
      if (typeof isCompleted !== 'undefined') {
        const index = objectStore.index('isCompleted');
        const range = IDBKeyRange.only(isCompleted ? 1 : 0);
        getAllRequest = index.getAll(range);
      } else {
        getAllRequest = objectStore.getAll();
      }

      getAllRequest.onsuccess = () => {
        if (!TodoDB.isTodoList(getAllRequest.result)) {
          return resolve([
            null,
            new Error('the returned value is not a todo list'),
          ]);
        }

        return resolve([getAllRequest.result.map(toTodo), null]);
      };
      getAllRequest.onerror = () =>
        resolve([null, new Error('failed to getList')]);
    });
  }

  public static isTodoList(data: unknown[]): data is TodoInDB[] {
    if (!Array.isArray(data)) {
      return false;
    }

    return data.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'title' in item &&
        'description' in item &&
        'isCompleted' in item &&
        'createdAt' in item
    );
  }

  public static isTodo(data: unknown): data is TodoInDB {
    if (typeof data !== 'object') {
      return false;
    }

    const todo = data as Partial<Todo>;

    return (
      'id' in todo &&
      'title' in todo &&
      'description' in todo &&
      'isCompleted' in todo &&
      'createdAt' in todo
    );
  }

  static getInstance(): TodoDB {
    if (!TodoDB.instance) {
      TodoDB.instance = new TodoDB(DatabaseService.getInstance());
    }
    return TodoDB.instance;
  }
}

export default TodoDB;
