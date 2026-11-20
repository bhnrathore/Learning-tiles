import { describe, expect, it } from 'vitest';
import {
  clearProgress,
  readProgress,
  saveProgress,
  type ProgressStorage,
} from './progress';

function memoryStorage(initial: string | null = null): ProgressStorage {
  let value = initial;
  return {
    getItem: () => value,
    setItem: (_, next) => {
      value = next;
    },
    removeItem: () => {
      value = null;
    },
  };
}

describe('on-device progress', () => {
  it('saves, reloads and clears completion without personal data', () => {
    const storage = memoryStorage();
    expect(saveProgress({ version: 1, completed: ['count'] }, storage)).toBe(
      true,
    );
    expect(readProgress(storage)).toEqual({ version: 1, completed: ['count'] });
    expect(clearProgress(storage)).toBe(true);
    expect(readProgress(storage).completed).toEqual([]);
  });
  it('recovers from invalid, outdated or malformed data', () => {
    for (const raw of [
      'bad',
      'null',
      '[]',
      '{"version":2,"completed":[]}',
      '{"version":1,"completed":[2]}',
    ]) {
      expect(readProgress(memoryStorage(raw)).completed).toEqual([]);
    }
    expect(
      readProgress(memoryStorage('{"version":1,"completed":["count","count"]}'))
        .completed,
    ).toEqual(['count']);
  });
  it('handles storage permissions and quotas without crashing', () => {
    const denied = () => {
      throw new Error('Storage unavailable');
    };
    const storage = { getItem: denied, setItem: denied, removeItem: denied };
    expect(readProgress(storage).completed).toEqual([]);
    expect(saveProgress({ version: 1, completed: [] }, storage)).toBe(false);
    expect(clearProgress(storage)).toBe(false);
  });
});
