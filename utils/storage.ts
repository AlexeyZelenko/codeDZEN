export const saveToStorage = (key: string, value: any): void => {
  if (process.client) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (process.client) {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  }
  return defaultValue;
};
