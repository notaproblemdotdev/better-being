import type { AuthState, RatingEntry, RatingsRange, RatingsStoreAdapter } from "../types";

const DB_NAME = "being_better";
const DB_VERSION = 1;
const STORE_NAME = "ratings";
const TIMESTAMP_INDEX = "timestampMs";

type StoredRatingEntry = {
  id?: number;
  timestamp: string;
  rating: number;
  timestampMs: number;
};

export class IndexedDbRatingsAdapter implements RatingsStoreAdapter {
  private ready = false;
  private authState: AuthState = "initializing";
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (!("indexedDB" in window)) {
      this.authState = "needs_login";
      throw new Error("IndexedDB is unavailable");
    }

    this.db = await openDatabase();
    this.ready = true;
    this.authState = "connected";
  }

  async appendRating(entry: RatingEntry): Promise<void> {
    const db = this.assertReady();
    const timestampMs = new Date(entry.timestamp).getTime();
    if (!Number.isFinite(timestampMs)) {
      throw new Error("Invalid timestamp");
    }

    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.add({
      timestamp: entry.timestamp,
      rating: entry.rating,
      timestampMs,
    } satisfies StoredRatingEntry);

    await Promise.all([requestToPromise(request), transactionDone(tx)]);
  }

  async listRatings(range: RatingsRange): Promise<RatingEntry[]> {
    const db = this.assertReady();
    const fromTime = new Date(range.fromIso).getTime();
    const toTime = new Date(range.toIso).getTime();
    if (!Number.isFinite(fromTime) || !Number.isFinite(toTime)) {
      return [];
    }

    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.index(TIMESTAMP_INDEX).getAll(IDBKeyRange.bound(fromTime, toTime));
    const rows = await requestToPromise(request);
    await transactionDone(tx);

    return rows
      .filter((row): row is StoredRatingEntry => Boolean(row) && typeof row.timestamp === "string" && Number.isFinite(row.rating))
      .map((row) => ({
        timestamp: row.timestamp,
        rating: row.rating,
      }));
  }

  isReady(): boolean {
    return this.ready;
  }

  getAuthState(): AuthState {
    return this.authState;
  }

  private assertReady(): IDBDatabase {
    if (!this.ready || !this.db) {
      throw new Error("Adapter not ready");
    }
    return this.db;
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      const store = db.objectStoreNames.contains(STORE_NAME)
        ? request.transaction?.objectStore(STORE_NAME)
        : db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });

      if (!store?.indexNames.contains(TIMESTAMP_INDEX)) {
        store?.createIndex(TIMESTAMP_INDEX, TIMESTAMP_INDEX, { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB"));
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed"));
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted"));
  });
}
