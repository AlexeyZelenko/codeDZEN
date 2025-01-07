import { ref } from "vue";

export function useLocalStorage() {
  const getValue = <T>(key: string): T | null => {
    if (!process.client) return null;

    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };

  const setValue = <T>(key: string, value: T): void => {
    if (!process.client) return;

    localStorage.setItem(key, JSON.stringify(value));
  };

  return {
    getValue,
    setValue,
  };
}
