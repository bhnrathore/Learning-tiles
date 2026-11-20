const key = 'twelve-tiles:progress';

export interface Progress {
  version: 1;
  completed: string[];
}

export type ProgressStorage = Pick<
  Storage,
  'getItem' | 'setItem' | 'removeItem'
>;
const empty = (): Progress => ({ version: 1, completed: [] });

function browserStorage(): ProgressStorage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function readProgress(storage = browserStorage()): Progress {
  try {
    const raw: unknown = JSON.parse(storage?.getItem(key) ?? 'null');
    if (
      typeof raw !== 'object' ||
      raw === null ||
      !('version' in raw) ||
      raw.version !== 1 ||
      !('completed' in raw) ||
      !Array.isArray(raw.completed) ||
      !raw.completed.every((id) => typeof id === 'string')
    )
      return empty();
    return { version: 1, completed: [...new Set(raw.completed)] };
  } catch {
    return empty();
  }
}

export function saveProgress(
  progress: Progress,
  storage = browserStorage(),
): boolean {
  try {
    if (!storage) return false;
    storage.setItem(key, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function clearProgress(storage = browserStorage()): boolean {
  try {
    if (!storage) return false;
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
