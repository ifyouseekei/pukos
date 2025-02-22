import DatabaseService from '../DatabaseService/DatabaseService';
import { Todo } from './TodosService.types';

class TodoDB {
  private static instance: TodoDB | null = null;

  static dbName = 'todoList';
  private databaseService: DatabaseService;
  private databaseInstance: IDBDatabase | null = null;
  private objectStore: IDBObjectStore | null = null;

  private constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  /**
   * Initializa DB and set its user store
   */
  async initDB(): Promise<void> {
    const [databaseInstance, error] = await this.databaseService.connect(
      TodoDB.dbName
    );
    if (error !== null) {
      throw error;
    }
    this.databaseInstance = databaseInstance;

    this.objectStore = this.databaseInstance.createObjectStore('todos', {
      autoIncrement: true,
    });

    // Create an index to search customers by name. We may have duplicates
    // so we can't use a unique index.
    this.objectStore.createIndex('title', 'title', { unique: false });
    this.objectStore.createIndex('description', 'description', {
      unique: false,
    });
  }

  /**
   * Add a todo
   */
  public add(todo: Todo): Promise<AppResponseType<Todo>> {
    return new Promise((resolve) => {
      if (!this.objectStore) {
        return resolve([null, new Error('no object store found')]);
      }

      const request = this.objectStore.add(todo);
      request.onsuccess = () => resolve([todo, null]);
      request.onerror = () => resolve([null, new Error('failed to save todo')]);
    });
  }

  /**
   * Delete a Todo by its key
   * @param key The key value of IndexedDB
   */
  public deleteByKey(key: number): Promise<Error | null> {
    return new Promise((resolve) => {
      if (!this.objectStore) {
        return resolve(new Error('no object store found'));
      }

      const request = this.objectStore.delete(key);
      request.onsuccess = () => resolve(null);
      request.onerror = () => resolve(new Error('failed to save todo'));
    });
  }

  /**
   * Get a Todo by its key
   * @param key The key value of IndexedDB
   */
  public getByKey(key: number): Promise<AppResponseType<Todo>> {
    return new Promise((resolve) => {
      if (!this.objectStore) {
        return resolve([null, new Error('no object store found')]);
      }

      const request = this.objectStore.get(key);
      request.onsuccess = () => {
        if (!TodoDB.isTodo(request.result)) {
          return resolve([null, new Error('the returned value is not a todo')]);
        }
        return resolve([request.result, null]);
      };
      request.onerror = () => resolve([null, new Error('failed to save todo')]);
    });
  }

  public static isTodo(data: unknown): data is Todo {
    if (typeof data !== 'object') {
      return false;
    }

    const todo = data as Partial<Todo>;

    return (
      typeof todo.title === 'string' &&
      typeof todo.description === 'string' &&
      typeof todo.isCompleted === 'boolean' &&
      todo.createdAt instanceof Date
    );
  }

  static getInstance(): TodoDB {
    if (!TodoDB.instance) {
      TodoDB.instance = new TodoDB(new DatabaseService());
    }
    return TodoDB.instance;
  }
}

export default TodoDB.getInstance();
