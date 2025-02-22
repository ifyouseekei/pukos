class DatabaseService {
  public db: IDBDatabase | null = null;

  constructor() {} // Prevent direct instantiation

  public connect(dbName: string): Promise<AppResponseType<IDBDatabase>> {
    // Return same instance if its already connected
    if (this.db) {
      return Promise.resolve([this.db, null]);
    }

    // Let us open version 4 of our database
    const DBOpenRequest = window.indexedDB.open(dbName, 1);

    return new Promise((resolve) => {
      // these two event handlers act on the database being opened successfully, or not
      DBOpenRequest.onerror = (event) => {
        console.error(event);
        resolve([null, new Error('unable to connect to the database')]);
      };

      DBOpenRequest.onsuccess = () => {
        // store the result of opening the database in the db variable. This is used a lot later on, for opening transactions and suchlike.
        this.db = DBOpenRequest.result;

        resolve([DBOpenRequest.result, null]);
      };
    });
  }
}

export default DatabaseService;
