import { expect, it } from 'vitest';
import { evaluate, validateLesson } from './game';
import { lessons, pictureNames } from './lessons';

it('provides three valid, independently authored lessons per subject', () => {
  expect(lessons).toHaveLength(9);
  expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(9);
  for (const subject of ['maths', 'letters', 'india']) {
    expect(lessons.filter((lesson) => lesson.subject === subject)).toHaveLength(
      3,
    );
  }
  for (const lesson of lessons) {
    expect(() => validateLesson(lesson)).not.toThrow();
    expect(
      evaluate(
        lesson,
        Object.fromEntries(
          lesson.prompts.map((prompt) => [prompt.answerId, prompt.id]),
        ),
      ).solved,
    ).toBe(true);
    expect(lesson.source).toBeTruthy();
    for (const item of [...lesson.prompts, ...lesson.slots]) {
      if (item.visual.kind === 'picture')
        expect(pictureNames.some(([id]) => id === item.visual.value)).toBe(
          true,
        );
    }
  }
});
