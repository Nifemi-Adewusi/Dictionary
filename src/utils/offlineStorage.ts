
// IndexedDB implementation for offline storage

const DB_NAME = 'wordwiseDB';
const DB_VERSION = 1;
const WORD_STORE = 'words';
const RECENT_SEARCHES_STORE = 'recentSearches';

// Initialize the database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event);
      reject('Error opening IndexedDB');
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create a store for words
      if (!db.objectStoreNames.contains(WORD_STORE)) {
        const wordStore = db.createObjectStore(WORD_STORE, { keyPath: 'word' });
        wordStore.createIndex('word', 'word', { unique: true });
      }
      
      // Create a store for recent searches
      if (!db.objectStoreNames.contains(RECENT_SEARCHES_STORE)) {
        db.createObjectStore(RECENT_SEARCHES_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

// Save word data to IndexedDB
export const saveWord = (wordData: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction(WORD_STORE, 'readwrite');
      const store = transaction.objectStore(WORD_STORE);
      
      const request = store.put(wordData);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = (event) => {
        console.error('Error saving word to IndexedDB:', event);
        reject('Error saving word to IndexedDB');
      };
    }).catch(reject);
  });
};

// Get word data from IndexedDB
export const getWord = (word: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction(WORD_STORE, 'readonly');
      const store = transaction.objectStore(WORD_STORE);
      
      const request = store.get(word);
      
      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        resolve(result);
      };
      
      request.onerror = (event) => {
        console.error('Error getting word from IndexedDB:', event);
        reject('Error getting word from IndexedDB');
      };
    }).catch(reject);
  });
};

// Save recent search to IndexedDB
export const saveRecentSearch = (word: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction(RECENT_SEARCHES_STORE, 'readwrite');
      const store = transaction.objectStore(RECENT_SEARCHES_STORE);
      
      // Check if word already exists
      const cursorRequest = store.openCursor();
      const recentSearches: string[] = [];
      
      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          recentSearches.push(cursor.value.word);
          cursor.continue();
        } else {
          // Check if word exists in recent searches
          if (recentSearches.includes(word)) {
            // Word exists, so no need to add it again
            resolve();
            return;
          }
          
          // Add word to recent searches
          const request = store.add({ word, timestamp: Date.now() });
          
          request.onsuccess = () => {
            // Limit to 10 recent searches
            if (recentSearches.length >= 10) {
              // Remove oldest search
              const oldest = recentSearches[0];
              const index = store.index('word');
              const deleteRequest = index.getKey(oldest).onsuccess = (event) => {
                const keyToDelete = (event.target as IDBRequest).result;
                if (keyToDelete) {
                  store.delete(keyToDelete);
                }
              };
            }
            
            resolve();
          };
          
          request.onerror = (event) => {
            console.error('Error saving recent search to IndexedDB:', event);
            reject('Error saving recent search to IndexedDB');
          };
        }
      };
      
      cursorRequest.onerror = (event) => {
        console.error('Error checking recent searches in IndexedDB:', event);
        reject('Error checking recent searches in IndexedDB');
      };
    }).catch(reject);
  });
};

// Get recent searches from IndexedDB
export const getRecentSearches = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction(RECENT_SEARCHES_STORE, 'readonly');
      const store = transaction.objectStore(RECENT_SEARCHES_STORE);
      
      const request = store.getAll();
      
      request.onsuccess = (event) => {
        const results = (event.target as IDBRequest).result;
        const searches = results.map(item => item.word);
        // Return most recent searches first
        searches.sort((a, b) => b.timestamp - a.timestamp);
        resolve(searches);
      };
      
      request.onerror = (event) => {
        console.error('Error getting recent searches from IndexedDB:', event);
        reject('Error getting recent searches from IndexedDB');
      };
    }).catch(reject);
  });
};
