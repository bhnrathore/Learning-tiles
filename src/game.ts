export type Subject = 'maths' | 'letters' | 'india';
export type AgeBand = '3-4' | '5-7';
export type Visual =
  | { kind: 'dots'; value: number }
  | { kind: 'text'; value: string }
  | { kind: 'picture'; value: string };

export interface Prompt {
  id: string;
  label: string;
  visual: Visual;
  answerId: string;
}

export interface AnswerSlot {
  id: string;
  label: string;
  visual: Visual;
}

export interface Lesson {
  id: string;
  subject: Subject;
  age: AgeBand;
  title: string;
  topic: string;
  prompts: Prompt[];
  slots: AnswerSlot[];
  source: string;
}

export type Placements = Record<string, string>;

export interface Evaluation {
  complete: boolean;
  solved: boolean;
  correctSlots: string[];
}

export function validateLesson(lesson: Lesson): void {
  const promptIds = new Set(lesson.prompts.map((prompt) => prompt.id));
  const slotIds = new Set(lesson.slots.map((slot) => slot.id));
  const answers = new Set(lesson.prompts.map((prompt) => prompt.answerId));
  if (
    lesson.prompts.length !== 12 ||
    lesson.slots.length !== 12 ||
    promptIds.size !== 12 ||
    slotIds.size !== 12 ||
    answers.size !== 12 ||
    lesson.prompts.some((prompt) => !slotIds.has(prompt.answerId)) ||
    new Set(lesson.slots.map((slot) => slot.label)).size !== 12 ||
    [...lesson.prompts, ...lesson.slots].some((item) => !item.id || !item.label)
  ) {
    throw new Error(`Invalid twelve-tile lesson: ${lesson.id}`);
  }
}

export function placeTile(
  lesson: Lesson,
  placements: Placements,
  tileId: string,
  slotId: string,
  lockedSlots: readonly string[] = [],
): Placements {
  if (
    !lesson.prompts.some((prompt) => prompt.id === tileId) ||
    !lesson.slots.some((slot) => slot.id === slotId) ||
    lockedSlots.includes(slotId)
  ) {
    return placements;
  }
  const previousSlot = Object.keys(placements).find(
    (key) => placements[key] === tileId,
  );
  if (
    previousSlot === slotId ||
    (previousSlot && lockedSlots.includes(previousSlot))
  )
    return placements;
  const next = { ...placements };
  const displacedTile = next[slotId];
  if (previousSlot) delete next[previousSlot];
  next[slotId] = tileId;
  if (previousSlot && displacedTile) next[previousSlot] = displacedTile;
  return next;
}

export function returnTile(
  placements: Placements,
  tileId: string,
  lockedSlots: readonly string[] = [],
): Placements {
  return Object.fromEntries(
    Object.entries(placements).filter(
      ([slotId, current]) => current !== tileId || lockedSlots.includes(slotId),
    ),
  );
}

export function evaluate(lesson: Lesson, placements: Placements): Evaluation {
  const entries = Object.entries(placements);
  const valid =
    entries.every(
      ([slotId, tileId]) =>
        lesson.slots.some((slot) => slot.id === slotId) &&
        lesson.prompts.some((prompt) => prompt.id === tileId),
    ) && new Set(Object.values(placements)).size === entries.length;
  const correctSlots = valid
    ? lesson.slots
        .filter(
          (slot) =>
            lesson.prompts.find((prompt) => prompt.id === placements[slot.id])
              ?.answerId === slot.id,
        )
        .map((slot) => slot.id)
    : [];
  const complete = valid && entries.length === 12;
  return {
    complete,
    solved: complete && correctSlots.length === 12,
    correctSlots,
  };
}
