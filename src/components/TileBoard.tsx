import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  ArrowDownToLine,
  Check,
  CheckCheck,
  CircleCheck,
  RotateCcw,
  Undo2,
} from 'lucide-react';
import {
  evaluate,
  placeTile,
  returnTile,
  type Lesson,
  type Placements,
  type Prompt,
} from '../game';
import { LearningVisual } from './LearningVisual';
import { PatternReveal } from './PatternReveal';
import { Dialog } from './Dialog';

const collisionDetection: CollisionDetection = (args) => {
  const pointer = pointerWithin(args);
  return pointer.length ? pointer : rectIntersection(args);
};

function Counter({
  prompt,
  number,
  selected,
  locked,
  onSelect,
}: {
  prompt: Prompt;
  number: number;
  selected: boolean;
  locked: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: prompt.id, disabled: locked });
  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      type="button"
      className={`counter ${selected ? 'selected' : ''} ${locked ? 'locked' : ''} ${isDragging ? 'dragging' : ''}`}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : undefined
      }
      onClick={onSelect}
      disabled={locked}
      aria-label={`Tile ${number}`}
      aria-pressed={selected}
      aria-describedby={selected ? 'active-prompt' : undefined}
    >
      {locked ? <Check size={21} /> : number}
    </button>
  );
}

function Answer({
  lesson,
  slotId,
  placements,
  selected,
  locked,
  checked,
  onPlace,
  onSelect,
}: {
  lesson: Lesson;
  slotId: string;
  placements: Placements;
  selected: string | null;
  locked: boolean;
  checked: boolean;
  onPlace: () => void;
  onSelect: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: slotId, disabled: locked });
  const slot = lesson.slots.find((item) => item.id === slotId)!;
  const tile = lesson.prompts.find(
    (prompt) => prompt.id === placements[slotId],
  );
  const number = tile ? lesson.prompts.indexOf(tile) + 1 : 0;
  return (
    <div
      ref={setNodeRef}
      className={`answer-slot ${tile ? 'occupied' : ''} ${isOver ? 'over' : ''} ${locked ? 'correct' : ''} ${checked && tile && !locked ? 'try-again' : ''}`}
    >
      <button
        className="answer-target"
        type="button"
        onClick={onPlace}
        disabled={locked}
        aria-label={`Answer ${slot.label}${tile ? `, holds tile ${number}` : ', empty'}`}
      >
        <LearningVisual visual={slot.visual} />
      </button>
      {tile && (
        <div className="placed-counter">
          <Counter
            prompt={tile}
            number={number}
            selected={selected === tile.id}
            locked={locked}
            onSelect={() => onSelect(tile.id)}
          />
        </div>
      )}
      {locked && (
        <span className="slot-correct" aria-hidden="true">
          <Check size={10} strokeWidth={3} />
        </span>
      )}
    </div>
  );
}

export function TileBoard({
  lesson,
  guided,
  onComplete,
  onNext,
  hasNext,
  isCompleted,
}: {
  lesson: Lesson;
  guided: boolean;
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
  isCompleted: boolean;
}) {
  const [placements, setPlacements] = useState<Placements>({});
  const [selected, setSelected] = useState<string | null>(lesson.prompts[0].id);
  const [checked, setChecked] = useState(false);
  const [lockedSlots, setLockedSlots] = useState<string[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [resetOpen, setResetOpen] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 7 } }),
    useSensor(KeyboardSensor, {
      keyboardCodes: { start: ['Space'], cancel: ['Escape'], end: ['Space'] },
    }),
  );
  const result = evaluate(lesson, placements);
  const count = Object.keys(placements).length;
  const activePrompt = lesson.prompts.find((prompt) => prompt.id === selected);
  const selectedNumber = activePrompt
    ? lesson.prompts.indexOf(activePrompt) + 1
    : null;
  const correctIndices = lesson.slots
    .map((slot, index) => (lockedSlots.includes(slot.id) ? index : -1))
    .filter((index) => index >= 0);

  function chooseTile(id: string) {
    const locked = lockedSlots.some((slotId) => placements[slotId] === id);
    if (!locked) setSelected(id);
  }

  function assign(tileId: string, slotId: string) {
    const next = placeTile(lesson, placements, tileId, slotId, lockedSlots);
    if (next === placements) return;
    setPlacements(next);
    setChecked(false);
    const nextPrompt = lesson.prompts.find(
      (prompt) => !Object.values(next).includes(prompt.id),
    );
    setSelected(nextPrompt?.id ?? null);
    const slot = lesson.slots.find((item) => item.id === slotId)!;
    setAnnouncement(
      `Tile ${lesson.prompts.findIndex((prompt) => prompt.id === tileId) + 1} placed on ${slot.label}. ${Object.keys(next).length} of 12 placed.`,
    );
  }

  function dragEnd(event: DragEndEvent) {
    setDragging(null);
    if (!event.over) return;
    if (event.over.id === 'counter-bank') {
      setPlacements(
        returnTile(placements, String(event.active.id), lockedSlots),
      );
      setSelected(String(event.active.id));
      setChecked(false);
      return;
    }
    assign(String(event.active.id), String(event.over.id));
  }

  function check() {
    if (!result.complete) return;
    setChecked(true);
    setLockedSlots(result.correctSlots);
    if (result.solved) {
      setSelected(null);
      setAnnouncement('All twelve matched! Your garden mosaic is complete.');
      onComplete();
    } else {
      const wrong = lesson.prompts.find(
        (prompt) => !result.correctSlots.includes(prompt.answerId),
      );
      setSelected(wrong?.id ?? null);
      setAnnouncement(
        `${result.correctSlots.length} of 12 matched. You can try the remaining tiles again.`,
      );
    }
  }

  function reset() {
    setPlacements({});
    setLockedSlots([]);
    setChecked(false);
    setSelected(lesson.prompts[0].id);
    setAnnouncement('Board reset.');
    setResetOpen(false);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={({ active }) => {
        setDragging(String(active.id));
        chooseTile(String(active.id));
      }}
      onDragEnd={dragEnd}
      onDragCancel={() => setDragging(null)}
    >
      <div className="play-layout">
        <section
          className="questions-section"
          aria-labelledby="questions-heading"
        >
          <div className="section-label">
            <h2 id="questions-heading">
              <span className="step-number">1</span> The questions
            </h2>
            <span className="tiny-label">12 discoveries</span>
          </div>
          <div className={`question-grid ${guided ? 'guided' : ''}`}>
            {lesson.prompts.map((prompt, index) => {
              const placed = Object.values(placements).includes(prompt.id);
              const correct = lockedSlots.includes(prompt.answerId);
              return (
                <button
                  key={prompt.id}
                  type="button"
                  className={`question ${selected === prompt.id ? 'active' : ''} ${correct ? 'matched' : ''}`}
                  onClick={() => chooseTile(prompt.id)}
                  disabled={correct}
                  aria-label={`Question ${index + 1}: ${prompt.label}`}
                  aria-pressed={selected === prompt.id}
                >
                  <span className="question-number">{index + 1}</span>
                  <LearningVisual visual={prompt.visual} />
                  <span
                    className={`question-state ${placed ? 'is-placed' : ''}`}
                    aria-hidden="true"
                  >
                    {correct ? (
                      <CircleCheck size={14} />
                    ) : placed ? (
                      <Check size={13} />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="active-prompt" id="active-prompt">
            {activePrompt ? (
              <>
                <span className="active-number">{selectedNumber}</span>
                <div>
                  <span className="eyebrow">YOUR QUESTION</span>
                  <strong>
                    {activePrompt.visual.kind === 'dots'
                      ? 'How many dots?'
                      : lesson.subject === 'letters'
                        ? 'Find its letter match'
                        : activePrompt.label}
                  </strong>
                </div>
                <LearningVisual visual={activePrompt.visual} />
              </>
            ) : (
              <>
                <span className="active-number">
                  <CheckCheck size={23} />
                </span>
                <div>
                  <span className="eyebrow">
                    {result.solved && checked
                      ? 'ALL MATCHED'
                      : 'READY WHEN YOU ARE'}
                  </span>
                  <strong>
                    {result.solved && checked
                      ? 'Lovely thinking!'
                      : 'Twelve tiles, all in place.'}
                  </strong>
                </div>
              </>
            )}
          </div>
          <CounterBank
            lesson={lesson}
            placements={placements}
            selected={selected}
            lockedSlots={lockedSlots}
            onSelect={chooseTile}
          />
          <div className="board-footer">
            <span>
              <span className="status-dot" />
              {isCompleted ? 'Completed before' : 'Take your time'}
            </span>
            {selected &&
              Object.values(placements).includes(selected) &&
              !lockedSlots.some((slot) => placements[slot] === selected) && (
                <button
                  className="text-button"
                  onClick={() => {
                    setPlacements(
                      returnTile(placements, selected, lockedSlots),
                    );
                    setChecked(false);
                    setAnnouncement('Tile returned to the bank.');
                  }}
                >
                  <Undo2 size={15} /> Return tile {selectedNumber}
                </button>
              )}
          </div>
        </section>
        <section className="answers-section" aria-labelledby="answers-heading">
          <div className="section-label">
            <h2 id="answers-heading">
              <span className="step-number">2</span> Find the matches
            </h2>
            <span className="placed-count" data-testid="placed-count">
              {count}
              <span className="muted"> / 12</span>
            </span>
          </div>
          <div className="tray">
            <div className="tray-top">
              <span className="tray-dot" />
              <span>THE ANSWER TRAY</span>
              <span className="tray-dot" />
            </div>
            <div className="answer-grid">
              {lesson.slots.map((slot) => (
                <Answer
                  key={slot.id}
                  lesson={lesson}
                  slotId={slot.id}
                  placements={placements}
                  selected={selected}
                  locked={lockedSlots.includes(slot.id)}
                  checked={checked}
                  onPlace={() => {
                    if (selected) assign(selected, slot.id);
                    else if (placements[slot.id])
                      chooseTile(placements[slot.id]);
                  }}
                  onSelect={chooseTile}
                />
              ))}
            </div>
            <div className="tray-bottom">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="check-controls">
            <button
              className="icon-button reset-button"
              title="Reset board"
              aria-label="Reset board"
              onClick={() => (count ? setResetOpen(true) : reset())}
            >
              <RotateCcw size={19} />
            </button>
            {checked && result.solved ? (
              <button
                className="primary-button"
                onClick={hasNext ? onNext : reset}
              >
                <CheckCheck size={19} />
                {hasNext ? 'Next discovery' : 'Play again'}
              </button>
            ) : (
              <button
                className="primary-button"
                onClick={check}
                disabled={!result.complete}
              >
                <CircleCheck size={19} /> Check my matches
              </button>
            )}
          </div>
          {checked && (
            <p
              className={`feedback ${result.solved ? 'success' : ''}`}
              role="status"
            >
              {result.solved
                ? 'All twelve! Look what you made.'
                : `${result.correctSlots.length} matched. A little more thinking?`}
            </p>
          )}
          <PatternReveal
            correctIndices={correctIndices}
            checked={lockedSlots.length > 0 || checked}
          />
        </section>
      </div>
      <DragOverlay dropAnimation={null}>
        {dragging ? (
          <span className="counter overlay-counter">
            {lesson.prompts.findIndex((prompt) => prompt.id === dragging) + 1}
          </span>
        ) : null}
      </DragOverlay>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      {resetOpen && (
        <Dialog title="A fresh start?" onClose={() => setResetOpen(false)}>
          <p>This board will be cleared. Completed lessons stay saved.</p>
          <div className="modal-actions">
            <button
              className="secondary-button"
              autoFocus
              onClick={() => setResetOpen(false)}
            >
              Keep playing
            </button>
            <button className="primary-button" onClick={reset}>
              Reset board
            </button>
          </div>
        </Dialog>
      )}
    </DndContext>
  );
}

function CounterBank({
  lesson,
  placements,
  selected,
  lockedSlots,
  onSelect,
}: {
  lesson: Lesson;
  placements: Placements;
  selected: string | null;
  lockedSlots: string[];
  onSelect: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: 'counter-bank' });
  return (
    <section
      ref={setNodeRef}
      className={`counter-bank ${isOver ? 'bank-over' : ''}`}
      aria-labelledby="tiles-heading"
    >
      <div className="section-label">
        <h2 id="tiles-heading">Your tiles</h2>
        <ArrowDownToLine size={15} />
      </div>
      <div className="counter-grid">
        {lesson.prompts.map((prompt, index) =>
          Object.values(placements).includes(prompt.id) ? (
            <span
              className="counter-placeholder"
              key={prompt.id}
              aria-label={`Tile ${index + 1} is in the tray`}
            >
              {index + 1}
            </span>
          ) : (
            <Counter
              key={prompt.id}
              prompt={prompt}
              number={index + 1}
              selected={selected === prompt.id}
              locked={lockedSlots.includes(prompt.answerId)}
              onSelect={() => onSelect(prompt.id)}
            />
          ),
        )}
      </div>
    </section>
  );
}
