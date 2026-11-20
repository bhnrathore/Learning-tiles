import { validateLesson, type Lesson, type Subject, type Visual } from './game';

type Pair = {
  prompt: Visual;
  answer: Visual;
  promptLabel: string;
  answerLabel: string;
};
const text = (value: string): Visual => ({ kind: 'text', value });
const order = [4, 0, 8, 2, 10, 6, 1, 11, 5, 9, 3, 7];

function makeLesson(
  id: string,
  subject: Subject,
  age: Lesson['age'],
  title: string,
  topic: string,
  pairs: Pair[],
  source = 'Original exercises authored for this prototype.',
): Lesson {
  const slots = pairs.map((pair, index) => ({
    id: `${id}-a${index + 1}`,
    label: pair.answerLabel,
    visual: pair.answer,
  }));
  const lesson: Lesson = {
    id,
    subject,
    age,
    title,
    topic,
    source,
    prompts: pairs.map((pair, index) => ({
      id: `${id}-p${index + 1}`,
      label: pair.promptLabel,
      visual: pair.prompt,
      answerId: slots[index].id,
    })),
    slots: order.map((index) => slots[index]),
  };
  validateLesson(lesson);
  return lesson;
}

function textPairs(prompts: string[], answers: string[]): Pair[] {
  return prompts.map((prompt, index) => ({
    prompt: text(prompt),
    answer: text(answers[index]),
    promptLabel: prompt,
    answerLabel: answers[index],
  }));
}

export const pictureNames = [
  ['diya', 'Diya'],
  ['kite', 'Kite'],
  ['lotus', 'Lotus'],
  ['tabla', 'Tabla'],
  ['peacock', 'Peacock'],
  ['mango', 'Mango'],
  ['elephant', 'Elephant'],
  ['banyan', 'Banyan tree'],
  ['taj', 'Taj Mahal'],
  ['india-gate', 'India Gate'],
  ['train', 'Train'],
  ['wheel', 'Spinning wheel'],
] as const;

const indiaSources =
  'Original illustrations and questions. Background references: ' +
  'Incredible India (Ministry of Tourism), https://www.incredibleindia.gov.in/; ' +
  'Archaeological Survey of India, https://asi.nic.in/; ' +
  'Gandhi Heritage Portal, https://www.gandhiheritageportal.org/. ' +
  'These sources do not endorse this app. Editorial review is pending.';

export const lessons: Lesson[] = [
  makeLesson(
    'count',
    'maths',
    '3-4',
    'Count the dots',
    'Counting',
    Array.from({ length: 12 }, (_, index) => ({
      prompt: { kind: 'dots', value: index + 1 },
      answer: text(`${index + 1}`),
      promptLabel: `${index + 1} ${index === 0 ? 'dot' : 'dots'}`,
      answerLabel: `${index + 1}`,
    })),
  ),
  makeLesson(
    'missing',
    'maths',
    '5-7',
    'The missing number',
    'Number sequences',
    textPairs(
      Array.from({ length: 12 }, (_, index) => `${index + 1}, ?, ${index + 3}`),
      Array.from({ length: 12 }, (_, index) => `${index + 2}`),
    ),
  ),
  makeLesson(
    'addition',
    'maths',
    '5-7',
    'Little sums',
    'Addition',
    textPairs(
      Array.from(
        { length: 12 },
        (_, index) =>
          `${Math.floor((index + 2) / 2)} + ${Math.ceil((index + 2) / 2)}`,
      ),
      Array.from({ length: 12 }, (_, index) => `${index + 2}`),
    ),
  ),
  makeLesson(
    'letters-first',
    'letters',
    '3-4',
    'Big & little letters',
    'A to L',
    textPairs(Array.from('ABCDEFGHIJKL'), Array.from('abcdefghijkl')),
  ),
  makeLesson(
    'letters-more',
    'letters',
    '5-7',
    'More letter friends',
    'M to X',
    textPairs(Array.from('MNOPQRSTUVWX'), Array.from('mnopqrstuvwx')),
  ),
  makeLesson(
    'letters-next',
    'letters',
    '5-7',
    'What comes next?',
    'Alphabet order',
    textPairs(
      Array.from('ABCDEFGHIJKL').map((letter) => `${letter}  ?`),
      Array.from('BCDEFGHIJKLM'),
    ),
  ),
  makeLesson(
    'india-pictures',
    'india',
    '3-4',
    'A little bit of India',
    'Picture pairs',
    pictureNames.map(([id, name]) => ({
      prompt: { kind: 'picture', value: id },
      answer: { kind: 'picture', value: id },
      promptLabel: name,
      answerLabel: name,
    })),
    indiaSources,
  ),
  makeLesson(
    'india-words',
    'india',
    '5-7',
    'Pictures & their names',
    'Culture & everyday life',
    pictureNames.map(([id, name]) => ({
      prompt: { kind: 'picture', value: id },
      answer: text(name),
      promptLabel: name,
      answerLabel: name,
    })),
    indiaSources,
  ),
  makeLesson(
    'india-history',
    'india',
    '5-7',
    'Places & stories',
    'Culture & history',
    textPairs(
      [
        'Marble monument in Agra',
        'War memorial arch in New Delhi',
        'Tool Gandhi used to spin yarn',
        'A small oil lamp',
        'A toy flown on a string',
        'A flower with floating leaves',
        'A pair of hand drums',
        'A bird with a colourful tail',
        'A fruit with one large stone',
        'An animal with a trunk',
        'A tree with hanging aerial roots',
        'A vehicle that runs on rails',
      ],
      [
        'Taj Mahal',
        'India Gate',
        'Spinning wheel',
        'Diya',
        'Kite',
        'Lotus',
        'Tabla',
        'Peacock',
        'Mango',
        'Elephant',
        'Banyan tree',
        'Train',
      ],
    ),
    indiaSources,
  ),
];

export const subjects: Record<Subject, { label: string; description: string }> =
  {
    maths: { label: 'Maths', description: 'Numbers & little discoveries' },
    letters: { label: 'Letters', description: 'An alphabet of possibilities' },
    india: { label: 'India', description: 'Places, culture & stories' },
  };
