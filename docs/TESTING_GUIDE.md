# 🧪 Comprehensive Testing Guide

## Table of Contents

1. [Overview](#overview)
2. [Testing Strategy](#testing-strategy)
3. [Test Types](#test-types)
4. [Setup and Configuration](#setup-and-configuration)
5. [Writing Tests](#writing-tests)
6. [Best Practices](#best-practices)
7. [Test Organization](#test-organization)
8. [Mocking and Fixtures](#mocking-and-fixtures)
9. [Performance Testing](#performance-testing)
10. [CI/CD Integration](#cicd-integration)
11. [Troubleshooting](#troubleshooting)

## Overview

This guide covers the comprehensive testing strategy for the Eqraa Center Hub Islamic Educational Management System. Our testing approach ensures reliability, performance, and maintainability across all levels of the application.

### Testing Goals

- **Reliability**: Ensure the application works as expected under various conditions
- **Performance**: Maintain fast load times and smooth user interactions
- **Accessibility**: Guarantee the application is usable by all users
- **Security**: Protect against common vulnerabilities and data breaches
- **Maintainability**: Make code changes safe and predictable

## Testing Strategy

We follow the Testing Pyramid approach:

```
    E2E Tests (5%)
   ─────────────────
  Integration Tests (15%)
 ─────────────────────────
Unit Tests (80%)
```

### Test Distribution

- **Unit Tests (80%)**: Fast, isolated tests for individual functions and components
- **Integration Tests (15%)**: Tests for API interactions and component integration
- **E2E Tests (5%)**: Full user journey tests across the application

## Test Types

### 1. Unit Tests

**Purpose**: Test individual functions, components, and modules in isolation

**Tools**: Vitest, React Testing Library

**Examples**:

- Data model validation
- Component rendering
- Utility functions
- Business logic

```typescript
// Example unit test
import { describe, it, expect } from "vitest";
import { studentSchema } from "@/lib/validations";

describe("Student Validation", () => {
  it("should validate valid student data", () => {
    const validStudent = {
      name: "محمد أحمد",
      age: 12,
      grade: "السادس الابتدائي",
      department: "quran",
    };

    const result = studentSchema.safeParse(validStudent);
    expect(result.success).toBe(true);
  });
});
```

### 2. Integration Tests

**Purpose**: Test how different parts of the application work together

**Tools**: Vitest, MSW (Mock Service Worker)

**Examples**:

- API client interactions
- Database operations
- Component integration
- State management

```typescript
// Example integration test
import { describe, it, expect, vi } from "vitest";
import { supabase } from "@/integrations/supabase/client";

describe("Supabase Integration", () => {
  it("should fetch teachers successfully", async () => {
    const mockTeachers = [{ id: "1", name: "Teacher 1", department: "quran" }];

    const mockSelect = vi.fn().mockResolvedValue({
      data: mockTeachers,
      error: null,
    });

    supabase.from = vi.fn().mockReturnValue({
      select: mockSelect,
    });

    const result = await supabase.from("teachers").select("*");
    expect(result.data).toEqual(mockTeachers);
  });
});
```

### 3. Component Tests

**Purpose**: Test React components with user interactions

**Tools**: Vitest, React Testing Library, userEvent

**Examples**:

- User interactions
- Form submissions
- Navigation
- State changes

```typescript
// Example component test
import { render, screen, userEvent } from "@/test/utils/test-utils";
import IconButton from "@/components/IconButton";

describe("IconButton Component", () => {
  it("should render correctly", () => {
    render(<IconButton icon="📚" label="Books" to="/books" />);

    const button = screen.getByRole("link", { name: /books/i });
    expect(button).toBeInTheDocument();
  });

  it("should handle navigation", async () => {
    const user = userEvent.setup();
    render(<IconButton icon="🏠" label="Home" to="/home" />);

    const button = screen.getByRole("link", { name: /home/i });
    await user.click(button);

    // Test navigation behavior
  });
});
```

### 4. End-to-End Tests

**Purpose**: Test complete user journeys across the application

**Tools**: Playwright

**Examples**:

- Authentication flows
- Multi-step forms
- Page navigation
- Real user scenarios

```typescript
// Example E2E test
import { test, expect } from "@/test/e2e/fixtures/auth";

test.describe("Authentication Flow", () => {
  test("should allow admin login", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "admin@eqraa.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/");
    await expect(page.locator("nav")).toBeVisible();
  });
});
```

### 5. Performance Tests

**Purpose**: Ensure the application meets performance standards

**Tools**: Custom performance scripts, Lighthouse

**Examples**:

- Render time measurement
- Bundle size analysis
- Memory usage monitoring
- Load testing

```javascript
// Example performance test
import { PerformanceTestSuite } from "../scripts/performance-test.js";

const suite = new PerformanceTestSuite();

// Test component render performance
const result = await suite.measureComponentRender(
  "../src/components/IconButton.tsx",
  { icon: "📚", label: "Test", to: "/test" }
);

console.log(`Average render time: ${result.average}ms`);
```

## Setup and Configuration

### 1. Install Dependencies

```bash
npm install --save-dev \
  vitest \
  @vitest/coverage-v8 \
  @vitest/ui \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  msw \
  @playwright/test \
  jsdom
```

### 2. Configure Vitest

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### 3. Configure Playwright

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/test/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html"],
    ["json", { outputFile: "playwright-report.json" }],
    ["junit", { outputFile: "playwright-results.xml" }],
  ],
  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:8080",
    reuseExistingServer: !process.env.CI,
  },
});
```

## Writing Tests

### Test Structure

Follow the AAA pattern (Arrange, Act, Assert):

```typescript
describe("Feature", () => {
  it("should do something", () => {
    // Arrange - Set up the test
    const input = "test input";
    const expected = "expected output";

    // Act - Execute the code being tested
    const result = functionUnderTest(input);

    // Assert - Verify the result
    expect(result).toBe(expected);
  });
});
```

### Test Naming

Use descriptive test names that explain the behavior:

```typescript
// Good
it("should validate student age between 5 and 25 years");
it("should redirect unauthenticated users to login page");
it("should show error message for invalid credentials");

// Avoid
it("works");
it("test validation");
it("login test");
```

### Test Organization

Organize tests by feature and type:

```
src/test/
├── components/          # Component tests
├── integrations/         # Integration tests
├── e2e/                 # End-to-end tests
├── types/               # Type tests
├── utils/               # Test utilities
├── mocks/               # Mock data and handlers
└── setup.ts             # Test configuration
```

## Best Practices

### 1. Test Isolation

Each test should be independent and not rely on other tests:

```typescript
// Good - Each test sets up its own data
describe("Student Management", () => {
  it("should create new student", () => {
    const studentData = createMockStudent();
    const result = createStudent(studentData);
    expect(result).toBeDefined();
  });

  it("should update existing student", () => {
    const student = createMockStudent();
    const updates = { name: "Updated Name" };
    const result = updateStudent(student.id, updates);
    expect(result.name).toBe(updates.name);
  });
});

// Bad - Tests depend on each other
describe("Student Management", () => {
  let studentId;

  it("should create student", () => {
    studentId = createStudent(createMockStudent()).id;
  });

  it("should update student", () => {
    // Depends on previous test
    updateStudent(studentId, { name: "Updated" });
  });
});
```

### 2. Meaningful Assertions

Make assertions that test the actual behavior:

```typescript
// Good - Specific assertions
expect(student.name).toBe("محمد أحمد");
expect(student.age).toBeGreaterThanOrEqual(5);
expect(student.department).toBe("quran");

// Avoid - Generic assertions
expect(result).toBeTruthy();
expect(student).toBeDefined();
```

### 3. Mock External Dependencies

Use mocks to isolate tests from external services:

```typescript
// Good - Mock external API
import { server } from "@/test/mocks/server";
import { rest } from "msw";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("should handle API errors", async () => {
  server.use(
    rest.get("/api/teachers", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  const result = await fetchTeachers();
  expect(result.error).toBeDefined();
});
```

### 4. Test User Behavior

Focus on testing what users care about:

```typescript
// Good - Test user behavior
it("should show loading state while fetching data", async () => {
  render(<StudentList />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("Students")).toBeInTheDocument();
  });

  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
});

// Avoid - Test implementation details
it("should set loading state to true", () => {
  const setLoading = vi.fn();
  fetchData(setLoading);
  expect(setLoading).toHaveBeenCalledWith(true);
});
```

## Mocking and Fixtures

### Mock Data

Create realistic mock data for testing:

```typescript
// src/test/mocks/data.ts
export const mockTeachers: Teacher[] = [
  {
    id: "teacher-1",
    name: "الشيخ أحمد محمد",
    specialization: "تجويد القرآن الكريم",
    department: "quran",
    isActive: true,
    createdAt: new Date("2023-01-15"),
    email: "ahmed@eqraa.com",
    phone: "0512345678",
    experience: 10,
  },
];

export const createMockTeacher = (
  overrides: Partial<Teacher> = {}
): Teacher => ({
  id: `teacher-${Date.now()}`,
  name: "معلم تجريبي",
  specialization: "تخصص تجريبي",
  department: "quran",
  isActive: true,
  createdAt: new Date(),
  ...overrides,
});
```

### API Mocking

Use MSW to mock API responses:

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const teachersHandlers = [
  http.get("/api/teachers", () => {
    return HttpResponse.json(mockTeachers);
  }),

  http.post("/api/teachers", async ({ request }) => {
    const newTeacher = await request.json();
    return HttpResponse.json(
      {
        ...newTeacher,
        id: `teacher-${Date.now()}`,
        created_at: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),
];
```

### Test Fixtures

Create reusable test fixtures:

```typescript
// src/test/e2e/fixtures/auth.ts
export const test = base.extend({
  authenticatedPage: async ({ page, context }, use) => {
    await context.addInitScript(() => {
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
});
```

## Performance Testing

### Render Performance

Measure component render times:

```typescript
// scripts/performance-test.js
async function measureComponentRender(
  componentPath,
  props = {},
  iterations = 10
) {
  const times = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    render(<Component {...props} />);
    const end = performance.now();
    times.push(end - start);
  }

  return {
    average: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
  };
}
```

### Bundle Analysis

Monitor bundle size and optimize:

```javascript
// scripts/bundle-analysis.js
import { gzipSync } from "zlib";
import { readFileSync } from "fs";

const bundle = readFileSync("./dist/index.js");
const gzipped = gzipSync(bundle);

console.log(`Bundle size: ${bundle.length} bytes`);
console.log(`Gzipped: ${gzipped.length} bytes`);
```

### Load Testing

Test application performance under load:

```javascript
// scripts/load-test.js
async function loadTest(endpoint, concurrency = 10, duration = 5000) {
  const startTime = performance.now();
  const endTime = startTime + duration;
  let totalRequests = 0;
  let successfulRequests = 0;

  while (performance.now() < endTime) {
    const promises = [];
    for (let i = 0; i < concurrency; i++) {
      promises.push(
        fetch(endpoint).then((r) => (r.ok ? successfulRequests++ : null))
      );
    }
    await Promise.all(promises);
    totalRequests += concurrency;
  }

  return {
    totalRequests,
    successfulRequests,
    successRate: (successfulRequests / totalRequests) * 100,
  };
}
```

## CI/CD Integration

### GitHub Actions

Automated testing pipeline:

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20.x"
          cache: "npm"

      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20.x"
          cache: "npm"

      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Test Scripts

Add test scripts to package.json:

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:component": "vitest run --config vitest.component.config.ts",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:coverage": "vitest --coverage",
    "test:performance": "node scripts/performance-test.js",
    "test:a11y": "pa11y-ci --sitemap http://localhost:8080/sitemap.xml"
  }
}
```

## Troubleshooting

### Common Issues

1. **Test Flakiness**

   - Use proper waits and timeouts
   - Mock external dependencies
   - Ensure test isolation

2. **Mock Setup Issues**

   - Reset mocks between tests
   - Use consistent mock data
   - Verify mock configurations

3. **Performance Test Failures**

   - Check system resources
   - Verify test environment
   - Adjust performance thresholds

4. **E2E Test Failures**
   - Increase timeouts
   - Check selectors
   - Verify test data

### Debugging Tips

1. **Use Test UI**

   ```bash
   npm run test:ui
   npm run test:e2e:ui
   ```

2. **Enable Debug Logging**

   ```typescript
   // vitest.config.ts
   export default defineConfig({
     test: {
       reporter: "verbose",
       logHeapUsage: true,
     },
   });
   ```

3. **Generate Coverage Reports**

   ```bash
   npm run test:coverage
   ```

4. **Use Browser DevTools**
   ```typescript
   // playwright.config.ts
   export default defineConfig({
     use: {
       headless: false,
       devtools: true,
     },
   });
   ```

### Test Maintenance

1. **Regular Updates**

   - Update test dependencies
   - Review test coverage
   - Refactor test utilities

2. **Documentation**

   - Document test patterns
   - Update testing guides
   - Share best practices

3. **Monitoring**
   - Track test performance
   - Monitor flaky tests
   - Analyze failure patterns

## Conclusion

This comprehensive testing strategy ensures the Eqraa Center Hub application is reliable, performant, and maintainable. By following these guidelines and best practices, we can deliver high-quality software that meets the needs of Islamic educational centers.

Remember that testing is an investment in code quality and user experience. The time spent writing tests will save countless hours of debugging and maintenance in the future.
