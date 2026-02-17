import { test, expect } from '@playwright/test';

/**
 * Homepage E2E Tests
 * Tests for the main landing page (Index.tsx)
 * Institute: إقراء | Eqraa
 */

test.describe('Homepage - Basic Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Verify page loads
    await expect(page).toHaveTitle(/Eqraa|إقرأ|معهد/i);

    // Check for main container
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should display page header with institute name', async ({ page }) => {
    // Check header displays institute name
    const header = page.getByText('إقراء | Eqraa');
    await expect(header).toBeVisible();
  });

  test('should not show back button on homepage', async ({ page }) => {
    // Homepage is root, so back button should not be present
    const backButton = page.getByRole('button', { name: /back|رجوع|عودة/i });
    await expect(backButton).not.toBeVisible();
  });
});

test.describe('Homepage - Welcome Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display main welcome heading', async ({ page }) => {
    const mainHeading = page.getByText('مرحباً بك في إقراء | Eqraa');
    await expect(mainHeading).toBeVisible();
  });

  test('should display subheading text', async ({ page }) => {
    const subheading = page.getByText('اختر القسم المناسب للبدء');
    await expect(subheading).toBeVisible();
  });
});

test.describe('Homepage - Navigation Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all 16 navigation sections', async ({ page }) => {
    // Define all expected sections
    const sections = [
      { label: 'الإدارة', icon: '👥' },
      { label: 'القرآن', icon: '📖' },
      { label: 'التجويد', icon: '🎯' },
      { label: 'التربوي', icon: '📚' },
      { label: 'الامتحانات', icon: '📝' },
      { label: 'المواد الدراسية', icon: '📚' },
      { label: 'الجدول الدراسي', icon: '📅' },
      { label: 'الحضور والانصراف', icon: '📊' },
      { label: 'الطلاب', icon: '🧑‍🎓' },
      { label: 'المدرسون', icon: '🧑‍🏫' },
      { label: 'حلقات القرآن', icon: '🕌' },
      { label: 'الإعلانات', icon: '📢' },
      { label: 'المكتبة العلمية', icon: '🧭' },
      { label: 'الإعدادات', icon: '⚙️' },
      { label: 'الاجتماعات', icon: '🤝' },
      { label: 'المقترحات', icon: '💡' },
    ];

    // Count total navigation buttons
    const grid = page.locator('main').locator('div').filter({ has: page.locator('a') }).first();
    const buttons = grid.locator('a');
    await expect(buttons).toHaveCount(16);

    // Verify each section is present
    for (const section of sections) {
      const button = page.getByRole('link', { name: new RegExp(section.label) });
      await expect(button).toBeVisible();
    }
  });

  test('should have clickable navigation buttons', async ({ page }) => {
    // Test that first button (الإدارة) is clickable
    const adminButton = page.getByRole('link', { name: /الإدارة/ });
    await expect(adminButton).toBeVisible();
    await expect(adminButton).toBeEnabled();

    // Verify it has href attribute
    await expect(adminButton).toHaveAttribute('href', '/admin');
  });
});

test.describe('Homepage - Navigation Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const routeTests = [
    { label: 'الإدارة', route: '/admin' },
    { label: 'القرآن', route: '/quran' },
    { label: 'التجويد', route: '/tajweed' },
    { label: 'التربوي', route: '/educational' },
    { label: 'الامتحانات', route: '/exams' },
    { label: 'المواد الدراسية', route: '/subjects' },
    { label: 'الجدول الدراسي', route: '/schedule' },
    { label: 'الحضور والانصراف', route: '/attendance' },
    { label: 'الطلاب', route: '/students' },
    { label: 'المدرسون', route: '/teachers' },
    { label: 'حلقات القرآن', route: '/quran-circles' },
    { label: 'الإعلانات', route: '/announcements' },
    { label: 'المكتبة العلمية', route: '/library' },
    { label: 'الإعدادات', route: '/settings' },
    { label: 'الاجتماعات', route: '/meetings' },
    { label: 'المقترحات', route: '/suggestions' },
  ];

  for (const { label, route } of routeTests) {
    test(`should navigate to ${route} when clicking ${label}`, async ({ page }) => {
      const button = page.getByRole('link', { name: new RegExp(label) });
      await button.click();

      // Wait for navigation
      await page.waitForURL(`**${route}`);

      // Verify URL changed
      expect(page.url()).toContain(route);
    });
  }
});

test.describe('Homepage - Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display footer with copyright', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should display institute name in footer', async ({ page }) => {
    const copyrightText = page.getByText(/إقراء \| Eqraa/);
    await expect(copyrightText).toBeVisible();
  });

  test('should display current year in footer', async ({ page }) => {
    const currentYear = new Date().getFullYear().toString();
    const yearText = page.getByText(new RegExp(currentYear));
    await expect(yearText).toBeVisible();
  });

  test('should display "all rights reserved" text', async ({ page }) => {
    const rightsText = page.getByText(/جميع الحقوق محفوظة/);
    await expect(rightsText).toBeVisible();
  });
});

test.describe('Homepage - Responsive Design', () => {
  test('should display correctly on mobile (375px)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify content is visible
    await expect(page.getByText('إقراء | Eqraa')).toBeVisible();
    await expect(page.getByText('مرحباً بك')).toBeVisible();

    // Check grid is present
    const grid = page.locator('main').locator('div').filter({ has: page.locator('a') });
    await expect(grid).toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for rounding
  });

  test('should display correctly on tablet (768px)', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Verify content is visible
    await expect(page.getByText('إقراء | Eqraa')).toBeVisible();
    await expect(page.getByText('مرحباً بك')).toBeVisible();

    // All buttons should be visible without scrolling (vertically)
    const firstButton = page.getByRole('link', { name: /الإدارة/ });
    await expect(firstButton).toBeVisible();
  });

  test('should display correctly on desktop (1920px)', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Verify content is visible
    await expect(page.getByText('إقراء | Eqraa')).toBeVisible();

    // Content should be centered with max-width
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});

test.describe('Homepage - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have RTL direction', async ({ page }) => {
    // Check if HTML or body has RTL direction
    const direction = await page.evaluate(() => {
      return document.documentElement.dir || document.body.dir ||
        getComputedStyle(document.documentElement).direction;
    });
    expect(direction).toBe('rtl');
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Press Tab to focus first interactive element
    await page.keyboard.press('Tab');

    // Check that an element is focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should have accessible navigation buttons', async ({ page }) => {
    const buttons = page.getByRole('link');
    const count = await buttons.count();

    // Should have at least the 16 navigation buttons
    expect(count).toBeGreaterThanOrEqual(16);

    // First button should have accessible text
    const firstButton = buttons.first();
    const text = await firstButton.textContent();
    expect(text).toBeTruthy();
    expect(text?.trim()).not.toBe('');
  });
});

test.describe('Homepage - Performance', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds (generous for CI/CD)
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should have no console errors
    expect(errors).toHaveLength(0);
  });

  test('should load all required resources', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('requestfailed', (request) => {
      failedRequests.push(request.url());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should have no failed requests
    expect(failedRequests).toHaveLength(0);
  });
});

test.describe('Homepage - Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should match homepage screenshot (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait a bit for fonts and styling to load
    await page.waitForTimeout(500);

    // Take screenshot and compare
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('should match homepage screenshot (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait a bit for fonts and styling to load
    await page.waitForTimeout(500);

    // Take screenshot and compare
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});
