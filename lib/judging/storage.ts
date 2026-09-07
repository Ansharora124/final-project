import { JudgingEntry } from './results';

export interface StoredEntry extends JudgingEntry { photo: Blob }

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('pixel-prize-judging', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('entries', { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Photo storage is unavailable in this browser.'));
  });
}

async function transact<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('entries', mode);
    const request = action(transaction.objectStore('entries'));
    transaction.oncomplete = () => { db.close(); resolve(request.result); };
    transaction.onabort = transaction.onerror = () => { db.close(); reject(new Error('Could not save photos. Check available browser storage and export your results.')); };
  });
}

export const loadEntries = () => transact('readonly', store => store.getAll()) as Promise<StoredEntry[]>;
export const saveEntry = (entry: StoredEntry) => transact('readwrite', store => store.put(entry));
export const deleteEntry = (id: string) => transact('readwrite', store => store.delete(id));
