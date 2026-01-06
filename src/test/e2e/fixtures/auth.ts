import { test as base, expect, Page, BrowserContext } from "@playwright/test";

// Define custom fixtures for authentication
type AuthFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
  teacherPage: Page;
  studentPage: Page;
};

// Extend base test with custom fixtures
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page, context }: { page: Page; context: BrowserContext }, use: (page: Page) => Promise<void>) => {
    // Mock authentication for a regular user
    await context.addInitScript(() => {
      window.localStorage.setItem("sb-access-token", "mock-access-token");
      window.localStorage.setItem("sb-refresh-token", "mock-refresh-token");
      window.localStorage.setItem(
        "sb-user",
        JSON.stringify({
          id: "test-user-id",
          email: "test@example.com",
          user_metadata: { role: "student" },
        })
      );
    });

    await page.goto("/");
    await use(page);
  },

  adminPage: async ({ page, context }: { page: Page; context: BrowserContext }, use: (page: Page) => Promise<void>) => {
    // Mock authentication for admin user
    await context.addInitScript(() => {
      window.localStorage.setItem("sb-access-token", "admin-access-token");
      window.localStorage.setItem("sb-refresh-token", "admin-refresh-token");
      window.localStorage.setItem(
        "sb-user",
        JSON.stringify({
          id: "admin-user-id",
          email: "admin@eqraa.com",
          user_metadata: { role: "admin" },
        })
      );
    });

    await page.goto("/");
    await use(page);
  },

  teacherPage: async ({ page, context }: { page: Page; context: BrowserContext }, use: (page: Page) => Promise<void>) => {
    // Mock authentication for teacher user
    await context.addInitScript(() => {
      window.localStorage.setItem("sb-access-token", "teacher-access-token");
      window.localStorage.setItem("sb-refresh-token", "teacher-refresh-token");
      window.localStorage.setItem(
        "sb-user",
        JSON.stringify({
          id: "teacher-user-id",
          email: "teacher@eqraa.com",
          user_metadata: { role: "teacher" },
        })
      );
    });

    await page.goto("/");
    await use(page);
  },

  studentPage: async ({ page, context }: { page: Page; context: BrowserContext }, use: (page: Page) => Promise<void>) => {
    // Mock authentication for student user
    await context.addInitScript(() => {
      window.localStorage.setItem("sb-access-token", "student-access-token");
      window.localStorage.setItem("sb-refresh-token", "student-refresh-token");
      window.localStorage.setItem(
        "sb-user",
        JSON.stringify({
          id: "student-user-id",
          email: "student@eqraa.com",
          user_metadata: { role: "student" },
        })
      );
    });

    await page.goto("/");
    await use(page);
  },
});

export { expect };
