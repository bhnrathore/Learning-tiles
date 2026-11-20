import { describe, expect, it } from 'vitest';
import {
  evaluate,
  placeTile,
  returnTile,
  validateLesson,
  type Lesson,
} from './game';

const lesson: Lesson = {
  id: 'test',
  subject: 'maths',
  age: '3-4',
  title: 'Count',
  topic: 'Counting',
  source: 'Original',
  prompts: Array.from({ length: 12 }, (_, index) => ({
    id: `p${index}`,
    label: `Question ${index}`,
    answerId: `s${index}`,
    visual: { kind: 'dots', value: index + 1 },
  })),
  slots: Array.from({ length: 12 }, (_, index) => ({
    id: `s${index}`,
    label: `${index + 1}`,
    visual: { kind: 'text', value: `${index + 1}` },
  })),
};
const solution = Object.fromEntries(
  lesson.prompts.map((prompt) => [prompt.answerId, prompt.id]),
);

describe('twelve-tile board', () => {
  it('validates exactly twelve unique, unambiguous pairs', () => {
    expect(() => validateLesson(lesson)).not.toThrow();
    expect(() =>
      validateLesson({ ...lesson, prompts: lesson.prompts.slice(1) }),
    ).toThrow();
    expect(() =>
      validateLesson({
        ...lesson,
        prompts: lesson.prompts.map(() => lesson.prompts[0]),
      }),
    ).toThrow();
    expect(() =>
      validateLesson({
        ...lesson,
        slots: lesson.slots.map((slot) => ({ ...slot, label: 'same' })),
      }),
    ).toThrow();
    expect(() =>
      validateLesson({
        ...lesson,
        prompts: lesson.prompts.map((prompt) => ({
          ...prompt,
          answerId: 'missing',
        })),
      }),
    ).toThrow();
  });
  it('accepts only a correct and complete mapping', () => {
    expect(evaluate(lesson, solution).solved).toBe(true);
    expect(evaluate(lesson, {}).complete).toBe(false);
    expect(
      evaluate(lesson, { ...solution, s0: 'p1', s1: 'p0' }).correctSlots,
    ).toHaveLength(10);
    expect(evaluate(lesson, { ...solution, s0: 'p1', s1: 'p0' }).solved).toBe(
      false,
    );
    const allWrong = Object.fromEntries(
      lesson.slots.map((slot, index) => [slot.id, `p${(index + 1) % 12}`]),
    );
    expect(evaluate(lesson, allWrong).correctSlots).toHaveLength(0);
  });
  it('rejects duplicate tiles and unknown ids', () => {
    expect(evaluate(lesson, { ...solution, s0: 'p1' }).complete).toBe(false);
    expect(evaluate(lesson, { ...solution, extra: 'p0' }).solved).toBe(false);
    expect(evaluate(lesson, { ...solution, s0: 'unknown' }).solved).toBe(false);
  });
  it('moves and swaps without duplicating counters', () => {
    const initial = { s0: 'p0', s1: 'p1' };
    expect(placeTile(lesson, initial, 'p0', 's1')).toEqual({
      s0: 'p1',
      s1: 'p0',
    });
    expect(placeTile(lesson, initial, 'p0', 's2')).toEqual({
      s1: 'p1',
      s2: 'p0',
    });
    expect(placeTile(lesson, initial, 'p2', 's0')).toEqual({
      s0: 'p2',
      s1: 'p1',
    });
    expect(initial).toEqual({ s0: 'p0', s1: 'p1' });
  });
  it('respects locked answers and returns unlocked counters', () => {
    expect(placeTile(lesson, solution, 'p0', 's1', ['s0'])).toEqual(solution);
    expect(placeTile(lesson, solution, 'p1', 's0', ['s0'])).toEqual(solution);
    expect(returnTile(solution, 'p0', ['s0'])).toEqual(solution);
    expect(returnTile({ s0: 'p0' }, 'p0')).toEqual({});
    expect(placeTile(lesson, {}, 'unknown', 's0')).toEqual({});
  });
  it('does not depend on visual order', () => {
    expect(
      evaluate({ ...lesson, slots: [...lesson.slots].reverse() }, solution)
        .solved,
    ).toBe(true);
  });
});
