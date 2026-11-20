import { test, expect, type Page } from '@playwright/test';
import { lessons } from '../src/lessons';

test('uses the Learning Tiles working name', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Learning Tiles | Twelve-tile activities');
  await expect(
    page.getByRole('link', { name: 'Learning Tiles home' }),
  ).toBeVisible();
});

const counting = lessons[0];

async function place(page: Page, number: number, answer: string) {
  await page
    .getByRole('button', { name: `Tile ${number}`, exact: true })
    .click();
  await page
    .getByRole('button', { name: `Answer ${answer}, empty`, exact: true })
    .click();
}

test('complete a lesson, reveal original mosaic, persist and clear progress', async ({
  page,
}, testInfo) => {
  const externalRequests: string[] = [];
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (
      !request.url().startsWith('http://127.0.0.1:5173') &&
      !request.url().startsWith('data:')
    )
      externalRequests.push(request.url());
  });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Count the dots' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Check my matches' }),
  ).toBeDisabled();
  await expect(page.locator('.question')).toHaveCount(12);
  await expect(page.locator('.answer-slot')).toHaveCount(12);
  await expect(page.locator('.counter-grid .counter')).toHaveCount(12);
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-initial.png`,
    fullPage: true,
  });
  const dimensions = await page.evaluate(() => ({
    width: innerWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.width);
  for (let index = 0; index < 12; index++)
    await place(page, index + 1, `${index + 1}`);
  await expect(page.getByTestId('placed-count')).toHaveText('12 / 12');
  await page.getByRole('button', { name: 'Check my matches' }).click();
  await expect(page.getByText('All twelve! Look what you made.')).toBeVisible();
  await expect(page.locator('.mosaic-cell.revealed')).toHaveCount(12);
  await expect(page.locator('.answer-slot.correct')).toHaveCount(12);
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-solved.png`,
    fullPage: true,
  });
  expect(
    await page.evaluate(async () => {
      const image = new Image();
      image.src = '/assets/garden-mosaic.svg';
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = 80;
      canvas.height = 60;
      const context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0, 80, 60);
      const data = context.getImageData(0, 0, 80, 60).data;
      const colours = new Set<string>();
      for (let index = 0; index < data.length; index += 16)
        colours.add(`${data[index]},${data[index + 1]},${data[index + 2]}`);
      return colours.size;
    }),
  ).toBeGreaterThan(15);
  await page.reload();
  await page.getByRole('button', { name: 'Grown-ups', exact: true }).click();
  await expect(
    page.getByText('1 of 9 complete', { exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Clear progress', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Clear everything', exact: true })
    .click();
  await expect(
    page.getByText('0 of 9 complete', { exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByTestId('placed-count')).toHaveText('0 / 12');
  expect(externalRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('wrong matches reveal only correct pieces and can be swapped to finish', async ({
  page,
}) => {
  await page.goto('/');
  for (let index = 0; index < 12; index++)
    await place(
      page,
      index + 1,
      `${index === 0 ? 2 : index === 1 ? 1 : index + 1}`,
    );
  await page.getByRole('button', { name: 'Check my matches' }).click();
  await expect(page.locator('.mosaic-cell.revealed')).toHaveCount(10);
  await expect(
    page.getByText('10 matched. A little more thinking?'),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem('twelve-tiles:progress')),
  ).toBeNull();
  await page.getByRole('button', { name: 'Tile 1', exact: true }).click();
  await page
    .getByRole('button', { name: 'Answer 1, holds tile 2', exact: true })
    .click();
  await page.getByRole('button', { name: 'Check my matches' }).click();
  await expect(page.locator('.mosaic-cell.revealed')).toHaveCount(12);
});

test('return, reset confirmation, lesson selection and age groups work', async ({
  page,
}) => {
  await page.goto('/');
  await place(page, 1, '1');
  await page
    .getByRole('button', { name: 'Question 1: 1 dot', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Return tile 1', exact: true })
    .click();
  await expect(page.getByTestId('placed-count')).toHaveText('0 / 12');
  await place(page, 1, '1');
  await page.getByRole('button', { name: 'Reset board', exact: true }).click();
  await expect(
    page.getByRole('dialog', { name: 'A fresh start?' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Keep playing', exact: true }).click();
  await expect(page.getByTestId('placed-count')).toHaveText('1 / 12');
  await page.getByRole('button', { name: 'Reset board', exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Reset board', exact: true })
    .click();
  await expect(page.getByTestId('placed-count')).toHaveText('0 / 12');
  await page.getByRole('button', { name: '5-7 years', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'The missing number' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Letters', exact: false })
    .first()
    .click();
  await expect(
    page.getByRole('heading', { name: 'More letter friends' }),
  ).toBeVisible();
  await page.getByRole('button', { name: /All discoveries/ }).click();
  await expect(page.locator('.lesson-choice')).toHaveCount(9);
  await page.getByRole('button', { name: /Places & stories/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Places & stories' }),
  ).toBeVisible();
  await expect(page.locator('.answer-slot')).toHaveCount(12);
});

test('complete a board using keyboard activation, without dragging', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop',
    'Keyboard acceptance is run on desktop.',
  );
  await page.goto('/');
  for (let index = 0; index < 12; index++) {
    const tile = page.getByRole('button', {
      name: `Tile ${index + 1}`,
      exact: true,
    });
    await tile.focus();
    await page.keyboard.press('Enter');
    const answer = page.getByRole('button', {
      name: `Answer ${index + 1}, empty`,
      exact: true,
    });
    await answer.focus();
    await page.keyboard.press('Enter');
  }
  await page.getByRole('button', { name: 'Check my matches' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('All twelve! Look what you made.')).toBeVisible();
});

test('mouse drag places a tile in the tray', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop',
    'Mouse drag acceptance is run on desktop.',
  );
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Tile 1', exact: true })
    .evaluate((element) => element.scrollIntoView({ block: 'end' }));
  const tile = await page
    .getByRole('button', { name: 'Tile 1', exact: true })
    .boundingBox();
  const target = await page
    .getByRole('button', { name: 'Answer 1, empty', exact: true })
    .boundingBox();
  await page.mouse.move(tile!.x + tile!.width / 2, tile!.y + tile!.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    tile!.x + tile!.width / 2 + 10,
    tile!.y + tile!.height / 2,
    { steps: 3 },
  );
  await page.mouse.move(
    target!.x + target!.width / 2,
    target!.y + target!.height / 2,
    { steps: 16 },
  );
  await page.mouse.up();
  await expect(page.getByTestId('placed-count')).toHaveText('1 / 12');
  await expect(
    page.getByRole('button', { name: 'Answer 1, holds tile 1', exact: true }),
  ).toBeVisible();
});

test('touch tap and touch drag both place counters', async ({
  page,
  context,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'tablet',
    'Touch acceptance is run on the tablet project.',
  );
  await page.goto('/');
  await page.getByRole('button', { name: 'Tile 1', exact: true }).tap();
  await page
    .getByRole('button', { name: 'Answer 1, empty', exact: true })
    .tap();
  await expect(page.getByTestId('placed-count')).toHaveText('1 / 12');
  const tile = await page
    .getByRole('button', { name: 'Tile 2', exact: true })
    .boundingBox();
  const target = await page
    .getByRole('button', { name: 'Answer 2, empty', exact: true })
    .boundingBox();
  const session = await context.newCDPSession(page);
  const start = { x: tile!.x + tile!.width / 2, y: tile!.y + tile!.height / 2 };
  const end = {
    x: target!.x + target!.width / 2,
    y: target!.y + target!.height / 2,
  };
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ ...start, id: 1 }],
  });
  for (let step = 1; step <= 16; step++) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [
        {
          x: start.x + ((end.x - start.x) * step) / 16,
          y: start.y + ((end.y - start.y) * step) / 16,
          id: 1,
        },
      ],
    });
  }
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  await expect(page.getByTestId('placed-count')).toHaveText('2 / 12');
});

test('malformed or denied storage does not prevent play', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('twelve-tiles:progress', '{malformed');
    Object.defineProperty(Storage.prototype, 'setItem', {
      value: () => {
        throw new DOMException('Denied', 'SecurityError');
      },
    });
  });
  await page.goto('/');
  for (const [index, prompt] of counting.prompts.entries()) {
    const slot = counting.slots.find((item) => item.id === prompt.answerId)!;
    await place(page, index + 1, slot.label);
  }
  await page.getByRole('button', { name: 'Check my matches' }).click();
  await expect(
    page.getByText('Progress is available for this visit only.', {
      exact: false,
    }),
  ).toBeVisible();
  await expect(page.locator('.mosaic-cell.revealed')).toHaveCount(12);
});

test('all nine lessons render without overflowing prompts or answer text', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  for (const lesson of lessons) {
    await page.getByRole('button', { name: /All discoveries/ }).click();
    await page
      .locator('.lesson-choice')
      .filter({ hasText: lesson.title })
      .click();
    await expect(
      page.getByRole('heading', { name: lesson.title, exact: true }),
    ).toBeVisible();
    await expect(page.locator('.question')).toHaveCount(12);
    const overflow = await page.evaluate(() => {
      const failures: string[] = [];
      for (const selector of [
        '.question-grid',
        '.answer-grid',
        '.counter-grid',
      ]) {
        const rectangles = Array.from(
          document.querySelector(selector)!.children,
        ).map((child) => child.getBoundingClientRect());
        for (let first = 0; first < rectangles.length; first++) {
          for (let second = first + 1; second < rectangles.length; second++) {
            const left = rectangles[first];
            const right = rectangles[second];
            if (
              Math.min(left.right, right.right) -
                Math.max(left.left, right.left) >
                1 &&
              Math.min(left.bottom, right.bottom) -
                Math.max(left.top, right.top) >
                1
            )
              failures.push(`${selector}: overlapping items`);
          }
        }
      }
      if (document.documentElement.scrollWidth > innerWidth)
        failures.push('page');
      for (const element of document.querySelectorAll(
        '.question .visual-text, .answer-target .visual-text, .question .picture, .answer-target .picture',
      )) {
        const content = element.getBoundingClientRect();
        const container = element.closest('button')!.getBoundingClientRect();
        if (
          content.left < container.left - 1 ||
          content.right > container.right + 1 ||
          content.top < container.top - 1 ||
          content.bottom > container.bottom + 1
        )
          failures.push(element.textContent || 'picture');
      }
      return failures;
    });
    expect(overflow, lesson.id).toEqual([]);
  }
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-history.png`,
    fullPage: true,
  });
});

test('dialogs keep focus inside and reduced motion disables reveal animations', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Grown-ups', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 14; index++) {
    await page.keyboard.press('Tab');
    expect(
      await page.evaluate(() =>
        document.querySelector('dialog')!.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  expect(
    await page.evaluate(() => {
      const element = document.querySelector('.mosaic-cell')!;
      element.classList.add('revealed');
      return getComputedStyle(element).animationName;
    }),
  ).toBe('none');
});
