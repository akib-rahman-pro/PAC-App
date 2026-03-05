
import { openDB, DBSchema } from 'idb';

interface SecureDB extends DBSchema {
  files: {
    key: string;
    value: {
      id: string;
      name: string;
      blob: Blob;
      mimeType: string;
      timestamp: number;
    };
  };
}

const DB_NAME = 'progga-secure-storage';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB<SecureDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'id' });
      }
    },
  });
};

export const storeSecureFile = async (id: string, name: string, blob: Blob) => {
  const db = await initDB();
  await db.put('files', {
    id,
    name,
    blob,
    mimeType: blob.type,
    timestamp: Date.now(),
  });
};

export const getSecureFile = async (id: string) => {
  const db = await initDB();
  return await db.get('files', id);
};

export const getAllSecureFiles = async () => {
  const db = await initDB();
  return await db.getAll('files');
};

export const deleteSecureFile = async (id: string) => {
  const db = await initDB();
  await db.delete('files', id);
};
