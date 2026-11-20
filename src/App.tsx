import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CaseSensitive,
  Check,
  ChevronRight,
  Compass,
  Flower2,
  Focus,
  Grid2X2,
  Heart,
  LockKeyhole,
  Monitor,
  ShieldCheck,
  Sprout,
  Trash2,
  Trophy,
} from 'lucide-react';
import { type AgeBand, type Lesson, type Subject } from './game';
import { lessons, subjects } from './lessons';
import {
  clearProgress,
  readProgress,
  saveProgress,
  type Progress,
} from './progress';
import { Dialog } from './components/Dialog';
import { TileBoard } from './components/TileBoard';
import nunitoLicense from '../node_modules/@fontsource/nunito/LICENSE?raw';
import frauncesLicense from '../node_modules/@fontsource/fraunces/LICENSE?raw';
import lucideLicense from '../node_modules/lucide-react/LICENSE?raw';

const subjectIcons = {
  maths: Calculator,
  letters: CaseSensitive,
  india: Compass,
};

export default function App() {
  const [lessonId, setLessonId] = useState('count');
  const [guided, setGuided] = useState(true);
  const [progress, setProgress] = useState<Progress>(() => {
    const saved = readProgress();
    return {
      ...saved,
      completed: saved.completed.filter((id) =>
        lessons.some((lesson) => lesson.id === id),
      ),
    };
  });
  const [dialog, setDialog] = useState<'lessons' | 'parents' | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [storageNotice, setStorageNotice] = useState('');
  const [boardVersion, setBoardVersion] = useState(0);
  const lesson = lessons.find((item) => item.id === lessonId)!;
  const subjectLessons = lessons.filter(
    (item) => item.subject === lesson.subject,
  );
  const lessonIndex = subjectLessons.findIndex((item) => item.id === lessonId);
  const nextLesson = lessons[lessons.indexOf(lesson) + 1];

  function chooseLesson(next: Lesson) {
    setLessonId(next.id);
    setGuided(next.age === '3-4');
    setDialog(null);
  }

  function chooseSubject(subject: Subject) {
    chooseLesson(
      lessons.find(
        (item) => item.subject === subject && item.age === lesson.age,
      ) ?? lessons.find((item) => item.subject === subject)!,
    );
  }

  function chooseAge(age: AgeBand) {
    if (lesson.age === age) return;
    chooseLesson(subjectLessons.find((item) => item.age === age)!);
  }

  function completeLesson() {
    if (progress.completed.includes(lessonId)) return;
    const next: Progress = {
      version: 1,
      completed: [...progress.completed, lessonId],
    };
    setProgress(next);
    if (!saveProgress(next))
      setStorageNotice(
        'Progress is available for this visit only. Your browser could not save it.',
      );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          aria-label="Learning Tiles home"
          onClick={(event) => {
            event.preventDefault();
            chooseLesson(lessons[0]);
          }}
        >
          <img src={`${import.meta.env.BASE_URL}assets/mark.svg`} width="37" height="37" alt="" />
          <span>
            learning
            <br />
            <strong>tiles</strong>
            <span className="prototype-label">PROTOTYPE</span>
          </span>
        </a>
        <div className="nav-eyebrow">A WORLD TO DISCOVER</div>
        <nav className="subject-nav" aria-label="Subjects">
          {(Object.keys(subjects) as Subject[]).map((subject, index) => {
            const Icon = subjectIcons[subject];
            return (
              <button
                key={subject}
                className={`subject-button ${lesson.subject === subject ? 'active' : ''}`}
                aria-label={subjects[subject].label}
                title={subjects[subject].label}
                aria-current={lesson.subject === subject ? 'page' : undefined}
                onClick={() => chooseSubject(subject)}
              >
                <Icon size={20} strokeWidth={1.7} />
                <span>{subjects[subject].label}</span>
                <span className="nav-number">0{index + 1}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-progress">
          <div className="progress-flower">
            <Flower2 size={32} strokeWidth={1.5} />
          </div>
          <strong>Growing, little by little.</strong>
          <span>{progress.completed.length} of 9 discoveries complete</span>
          <div className="progress-track">
            <span
              style={{ width: `${(progress.completed.length / 9) * 100}%` }}
            />
          </div>
          <div className="progress-stems" aria-hidden="true">
            {Array.from({ length: 9 }, (_, index) => (
              <span
                className={index < progress.completed.length ? 'filled' : ''}
                key={index}
              />
            ))}
          </div>
        </div>
        <div className="sidebar-bottom">
          <span>
            <Heart size={14} /> A little wonder, every day.
          </span>
          <button
            onClick={() => {
              setConfirmClear(false);
              setDialog('parents');
            }}
          >
            <ShieldCheck size={16} /> Grown-ups' corner{' '}
            <ChevronRight size={14} />
          </button>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <span>My activities</span>
            <ChevronRight size={14} />
            <strong>{subjects[lesson.subject].label}</strong>
          </div>
          <div className="topbar-right">
            <span className="local-badge">
              <span className="status-dot" /> On this device
            </span>
            <button
              className="parent-button"
              onClick={() => {
                setConfirmClear(false);
                setDialog('parents');
              }}
            >
              <LockKeyhole size={15} />
              <span>Grown-ups</span>
            </button>
          </div>
        </header>
        <main>
          <div className="lesson-heading">
            <div>
              <div className="lesson-eyebrow">
                <span className={`subject-dot ${lesson.subject}`} />
                {lesson.topic}
                <span className="eyebrow-divider">/</span>LESSON 0
                {lessonIndex + 1}
              </div>
              <h1>
                {lesson.title}
                <span className="heading-spark" aria-hidden="true">
                  ✳
                </span>
              </h1>
            </div>
            <button
              className="secondary-button lesson-picker"
              onClick={() => setDialog('lessons')}
            >
              <BookOpen size={17} /> All discoveries <span>09</span>
            </button>
          </div>
          <div className="lesson-toolbar">
            <div className="age-selector" role="group" aria-label="Age group">
              {(['3-4', '5-7'] as AgeBand[]).map((age) => (
                <button
                  key={age}
                  aria-pressed={lesson.age === age}
                  className={lesson.age === age ? 'active' : ''}
                  onClick={() => chooseAge(age)}
                >
                  {age} years
                </button>
              ))}
            </div>
            <label className="guided-control">
              <Focus size={16} />
              <span>Guided focus</span>
              <input
                type="checkbox"
                role="switch"
                checked={guided}
                onChange={(event) => setGuided(event.target.checked)}
              />
              <span className="switch-track" aria-hidden="true" />
            </label>
          </div>
          {storageNotice && (
            <p className="storage-notice" role="status">
              {storageNotice}
            </p>
          )}
          <TileBoard
            key={`${lesson.id}-${boardVersion}`}
            lesson={lesson}
            guided={guided}
            onComplete={completeLesson}
            onNext={() => {
              if (nextLesson) chooseLesson(nextLesson);
            }}
            hasNext={!!nextLesson}
            isCompleted={progress.completed.includes(lesson.id)}
          />
          <footer className="page-footer">
            <span>
              <Sprout size={15} /> Small steps. Wonderful discoveries.
            </span>
            <span>
              Made for curious minds <span className="footer-separator">·</span>{' '}
              Ages 3-7
            </span>
          </footer>
        </main>
      </div>
      {dialog === 'lessons' && (
        <Dialog
          title="A world of little discoveries"
          onClose={() => setDialog(null)}
          wide
        >
          <div className="lesson-library">
            {(Object.keys(subjects) as Subject[]).map((subject) => {
              const Icon = subjectIcons[subject];
              return (
                <section key={subject}>
                  <h3>
                    <Icon size={18} />
                    {subjects[subject].label}
                  </h3>
                  <div className="lesson-list">
                    {lessons
                      .filter((item) => item.subject === subject)
                      .map((item, index) => (
                        <button
                          key={item.id}
                          className={`lesson-choice ${item.id === lessonId ? 'current' : ''}`}
                          onClick={() => chooseLesson(item)}
                        >
                          <span className="lesson-choice-number">
                            0{index + 1}
                          </span>
                          <span>
                            <strong>{item.title}</strong>
                            <small>
                              {item.age} years · {item.topic}
                            </small>
                          </span>
                          {progress.completed.includes(item.id) ? (
                            <span
                              className="completion-badge"
                              aria-label="Completed"
                            >
                              <Check size={17} />
                            </span>
                          ) : (
                            <ArrowRight size={17} />
                          )}
                        </button>
                      ))}
                  </div>
                </section>
              );
            })}
          </div>
        </Dialog>
      )}
      {dialog === 'parents' && (
        <Dialog title="Grown-ups' corner" onClose={() => setDialog(null)}>
          <div className="parent-summary">
            <Trophy size={26} />
            <div>
              <strong>{progress.completed.length} of 9 complete</strong>
              <span>Progress on this device</span>
            </div>
          </div>
          <section className="parent-section">
            <h3>
              <Grid2X2 size={17} /> Learning together
            </h3>
            <p>
              Each numbered question has a matching tile. Choose a tile, then
              its answer in the tray. Check after placing all twelve. Correct
              matches stay in place; the others can be moved or swapped.
            </p>
            <p>
              For pre-readers, an adult can read the prompts. Guided focus
              highlights the current question. All lessons use twelve tiles,
              including the early counting activities.
            </p>
          </section>
          <section className="parent-section">
            <h3>
              <Monitor size={17} /> Privacy & progress
            </h3>
            <p>
              This prototype has no child accounts, ads, analytics, or payments.
              Only completed lesson identifiers are saved in this browser.
              Progress is not shared between devices. The hosting provider may
              retain connection logs.
            </p>
            {confirmClear ? (
              <div className="clear-confirm">
                <p>Clear saved completions and the current board?</p>
                <div className="modal-actions">
                  <button
                    className="secondary-button"
                    onClick={() => setConfirmClear(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="danger-button"
                    onClick={() => {
                      if (clearProgress()) {
                        setProgress({ version: 1, completed: [] });
                        setBoardVersion((value) => value + 1);
                        setStorageNotice('');
                        setConfirmClear(false);
                      } else
                        setStorageNotice(
                          'Your browser could not clear saved progress. Please use its site-data settings.',
                        );
                    }}
                  >
                    <Trash2 size={15} /> Clear everything
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="text-button danger-text"
                onClick={() => setConfirmClear(true)}
              >
                <Trash2 size={15} /> Clear progress
              </button>
            )}
          </section>
          <section className="parent-section credits">
            <h3>Content & credits</h3>
            <p>
              Exercises, the garden mosaic, and custom illustrations were
              created for this prototype. Interface and selected picture icons:
              Lucide (ISC). Fonts: Nunito and Fraunces (SIL Open Font License),
              served locally.
            </p>
            <p>
              Culture and history background:{' '}
              <a
                href="https://www.incredibleindia.gov.in/"
                target="_blank"
                rel="noreferrer"
              >
                Incredible India
              </a>
              ,{' '}
              <a href="https://asi.nic.in/" target="_blank" rel="noreferrer">
                Archaeological Survey of India
              </a>
              , and{' '}
              <a
                href="https://www.gandhiheritageportal.org/"
                target="_blank"
                rel="noreferrer"
              >
                Gandhi Heritage Portal
              </a>
              . Sources do not endorse this app. Editorial review is pending.
            </p>
            <details className="license-details">
              <summary>Font & icon licenses</summary>
              <h4>Nunito</h4>
              <pre>{nunitoLicense}</pre>
              <h4>Fraunces</h4>
              <pre>{frauncesLicense}</pre>
              <h4>Lucide</h4>
              <pre>{lucideLicense}</pre>
            </details>
            <p className="prototype-note">
              Independent prototype. Branding, content, design, and applicable
              IP rights need professional review before commercial release.
            </p>
          </section>
        </Dialog>
      )}
    </div>
  );
}
