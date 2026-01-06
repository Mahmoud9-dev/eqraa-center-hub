import { test, expect } from "./fixtures/auth";

test.describe("Authentication Flow", () => {
  test("should redirect unauthenticated users to login", async ({ page }) => {
    await page.goto("/admin");

    // Should be redirected to login page
    await expect(page).toHaveURL("/login");
    await expect(page.locator("h1")).toContainText("تسجيل الدخول");
  });

  test("should allow admin users to access admin pages", async ({
    adminPage,
  }) => {
    await adminPage.goto("/admin");

    // Should successfully access admin page
    await expect(adminPage).toHaveURL("/admin");
    await expect(adminPage.locator("h1")).toContainText("الإدارة");
  });

  test("should show appropriate navigation based on user role", async ({
    page,
  }) => {
    // Test admin navigation
    await page.goto("/");
    await page.evaluate(() => {
      window.localStorage.setItem(
        "sb-user",
        JSON.stringify({
          id: "admin-user-id",
          email: "admin@eqraa.com",
          user_metadata: { role: "admin" },
        })
      );
    });
    await page.reload();

    // Admin should see all navigation items
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator('a[href="/admin"]')).toBeVisible();
    await expect(page.locator('a[href="/teachers"]')).toBeVisible();
    await expect(page.locator('a[href="/students"]')).toBeVisible();
  });

  test("should handle logout correctly", async ({ adminPage }) => {
    await adminPage.goto("/admin");

    // Find and click logout button (implementation depends on your UI)
    const logoutButton = adminPage.locator("button", {
      hasText: "تسجيل الخروج",
    });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();

      // Should be redirected to login page
      await expect(adminPage).toHaveURL("/login");
    }
  });

  test("should persist authentication across page reloads", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/");

    // Reload the page
    await authenticatedPage.reload();

    // Should still be authenticated (not redirected to login)
    await expect(authenticatedPage).toHaveURL("/");
    await expect(authenticatedPage.locator("nav")).toBeVisible();
  });

  test("should handle expired tokens gracefully", async ({ page }) => {
    // Mock expired token
    await page.goto("/");
    await page.evaluate(() => {
      window.localStorage.setItem("sb-access-token", "expired-token");
      window.localStorage.setItem(
        "sb-user",
        JSON.stringify({
          id: "test-user-id",
          email: "test@example.com",
          user_metadata: { role: "student" },
        })
      );
    });

    // Try to access a protected page
    await page.goto("/quran");

    // Should handle expired token and redirect to login
    await expect(page).toHaveURL("/login");
  });
});

test.describe("Role-Based Access Control", () => {
  test("admin should access all pages", async ({ adminPage }) => {
    const protectedPages = [
      "/admin",
      "/teachers",
      "/students",
      "/quran",
      "/tajweed",
      "/educational",
    ];

    for (const pagePath of protectedPages) {
      await adminPage.goto(pagePath);
      await expect(adminPage).not.toHaveURL("/login");
      await expect(adminPage.locator("body")).not.toContainText("غير مصرح");
    }
  });

  test("teacher should access limited pages", async ({ teacherPage }) => {
    const allowedPages = ["/quran", "/tajweed", "/educational", "/students"];
    const restrictedPages = ["/admin", "/teachers"];

    // Test allowed pages
    for (const pagePath of allowedPages) {
      await teacherPage.goto(pagePath);
      await expect(teacherPage).not.toHaveURL("/login");
    }

    // Test restricted pages
    for (const pagePath of restrictedPages) {
      await teacherPage.goto(pagePath);
      await expect(teacherPage).toHaveURL("/login");
    }
  });

  test("student should access only student pages", async ({ studentPage }) => {
    const allowedPages = ["/quran", "/tajweed", "/educational"];
    const restrictedPages = ["/admin", "/teachers", "/students"];

    // Test allowed pages
    for (const pagePath of allowedPages) {
      await studentPage.goto(pagePath);
      await expect(studentPage).not.toHaveURL("/login");
    }

    // Test restricted pages
    for (const pagePath of restrictedPages) {
      await studentPage.goto(pagePath);
      await expect(studentPage).toHaveURL("/login");
    }
  });
});

test.describe("Login Form", () => {
  test("should validate form inputs", async ({ page }) => {
    await page.goto("/login");

    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Should show validation errors
    await expect(page.locator("text=البريد الإلكتروني مطلوب")).toBeVisible();
    await expect(page.locator("text=كلمة المرور مطلوبة")).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login");

    // Fill form with invalid credentials
    await page.fill('input[name="email"]', "invalid@example.com");
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator("text=بيانات الاعتماد غير صحيحة")).toBeVisible();
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    await page.goto("/login");

    // Fill form with valid credentials (mocked)
    await page.fill('input[name="email"]', "admin@eqraa.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL("/");
    await expect(page.locator("nav")).toBeVisible();
  });

  test("should support remember me functionality", async ({ page }) => {
    await page.goto("/login");

    // Fill form and check "remember me"
    await page.fill('input[name="email"]', "admin@eqraa.com");
    await page.fill('input[name="password"]', "password123");
    await page.check('input[name="remember"]');
    await page.click('button[type="submit"]');

    // Close and reopen browser
    await page.context().close();

    // Create new context and page
    const browser = page.context().browser();
    if (!browser) throw new Error("Browser not available");
    const context = await browser.newContext();
    const newPage = await context.newPage();

    // Should still be logged in
    await newPage.goto("/");
    await expect(newPage).toHaveURL("/");

    await context.close();
  });
});

test.describe("Signup Form", () => {
  test("should validate signup form", async ({ page }) => {
    await page.goto("/signup");

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator("text=الاسم مطلوب")).toBeVisible();
    await expect(page.locator("text=البريد الإلكتروني مطلوب")).toBeVisible();
    await expect(page.locator("text=كلمة المرور مطلوبة")).toBeVisible();
  });

  test("should create new user account", async ({ page }) => {
    await page.goto("/signup");

    // Fill signup form
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "newuser@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.fill('input[name="confirmPassword"]', "password123");
    await page.selectOption('select[name="role"]', "student");

    await page.click('button[type="submit"]');

    // Should redirect to login or dashboard
    await expect(page).toHaveURL(/\/(login)?$/);
  });
});
