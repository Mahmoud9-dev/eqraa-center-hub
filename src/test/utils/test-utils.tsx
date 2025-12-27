import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { vi, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Test providers wrapper
interface AllTheProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

const AllTheProviders = ({
  children,
  queryClient = createTestQueryClient(),
}: AllTheProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <BrowserRouter>
            {children}
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { queryClient?: QueryClient }
) => {
  const { queryClient, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders queryClient={queryClient}>{children}</AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Mock user for testing
export const mockUser = {
  id: "test-user-id",
  email: "test@example.com",
  role: "admin" as const,
  user_metadata: { role: "admin" },
};

// Helper functions for testing
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

export const createMockRouter = (initialPath = "/") => {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    pathname: initialPath,
    query: {},
    asPath: initialPath,
  };
};

// Custom matchers for better assertions
export const expectToBeInTheDocument = (element: HTMLElement | null) => {
  expect(element).toBeInTheDocument();
};

export const expectToHaveTextContent = (
  element: HTMLElement | null,
  text: string
) => {
  expect(element).toHaveTextContent(text);
};

export const expectToBeDisabled = (element: HTMLElement) => {
  expect(element).toBeDisabled();
};

export const expectToBeEnabled = (element: HTMLElement) => {
  expect(element).not.toBeDisabled();
};

// Form testing helpers
export const fillForm = (form: HTMLElement, data: Record<string, string>) => {
  Object.entries(data).forEach(([name, value]) => {
    const field = form.querySelector(`[name="${name}"]`) as HTMLInputElement;
    if (field) {
      field.value = value;
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
};

export const submitForm = (form: HTMLElement) => {
  const submitButton = form.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement;
  if (submitButton) {
    submitButton.click();
  }
};

// Accessibility testing helpers
export const checkAccessibility = async (container: HTMLElement) => {
  // This would integrate with axe-core for accessibility testing
  // For now, we'll just check basic accessibility requirements
  const buttons = container.querySelectorAll("button");
  buttons.forEach((button) => {
    if (!button.getAttribute("aria-label") && !button.textContent?.trim()) {
      console.warn("Button without accessible name:", button);
    }
  });

  const inputs = container.querySelectorAll("input");
  inputs.forEach((input) => {
    if (
      !input.getAttribute("aria-label") &&
      !input.getAttribute("placeholder")
    ) {
      const label = container.querySelector(`label[for="${input.id}"]`);
      if (!label) {
        console.warn("Input without accessible label:", input);
      }
    }
  });
};

// Performance testing helpers
export const measureRenderTime = async (
  Component: ReactElement,
  iterations = 10
) => {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    const { unmount } = customRender(Component);
    const end = performance.now();
    times.push(end - start);
    unmount();
  }

  return {
    average: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
    times,
  };
};

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export { customRender as render };
export { default as userEvent } from "@testing-library/user-event";
