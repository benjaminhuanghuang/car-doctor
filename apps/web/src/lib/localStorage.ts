export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    // Try to parse as JSON, if it fails, return the raw string value
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  } catch (error) {
    console.error(`Error getting item '${key}' from localStorage:`, error);
    return null;
  }
}

export function setItem<T>(key: string, value: T) {
  try {
    // Don't stringify if value is already a string
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error setting item '${key}' in localStorage:`, error);
  }
}
