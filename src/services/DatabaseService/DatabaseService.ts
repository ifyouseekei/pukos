class DatabaseService {
  private static instance: DatabaseService;
  public db: IDBDatabase | null = null;
  public readonly dbName: string = 'AppDatabase'; // Fixed DB name
  public readonly version: number = 1; // Database version

  private constructor() {} // Private constructor to enforce singleton

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public connect(
    createStores: (db: IDBDatabase) => void
  ): Promise<AppResponseType<IDBDatabase>> {
    return new Promise((resolve) => {
      const DBOpenRequest = window.indexedDB.open(this.dbName, this.version);

      DBOpenRequest.onerror = (event) => {
        console.error(event);
        resolve([null, new Error('Unable to connect to the database')]);
      };

      DBOpenRequest.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.db = db;

        createStores(db);
      };

      DBOpenRequest.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db) {
          return resolve([null, new Error('db was not initialized')]);
        }

        resolve([db, null]);
      };
    });
  }

  public transaction(
    storeName: string | string[],
    mode: IDBTransactionMode = 'readonly',
    options?: IDBTransactionOptions
  ): AppResponseType<IDBTransaction> {
    if (!this.db) {
      return [null, new Error('Database not initialized')];
    }

    try {
      const transaction = this.db.transaction(storeName, mode, options);
      return [transaction, null];
    } catch (err) {
      return [
        null,
        err instanceof Error ? err : new Error('Transaction failed'),
      ];
    }
  }

  public getObjectStore(
    storeName: string,
    mode: IDBTransactionMode = 'readonly',
    options?: IDBTransactionOptions
  ): AppResponseType<IDBObjectStore> {
    if (!this.db) {
      return [null, new Error('Database not initialized')];
    }

    try {
      const objectStore = this.db
        .transaction(storeName, mode, options)
        .objectStore(storeName);
      return [objectStore, null];
    } catch (err) {
      return [
        null,
        err instanceof Error ? err : new Error('Transaction failed'),
      ];
    }
  }
}

export default DatabaseService;
