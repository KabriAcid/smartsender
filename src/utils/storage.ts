// LocalStorage Utility Functions

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      console.error(`Error reading from localStorage key "${key}"`);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`Error writing to localStorage key "${key}"`);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      console.error(`Error removing localStorage key "${key}"`);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch {
      console.error('Error clearing localStorage');
    }
  },
};
