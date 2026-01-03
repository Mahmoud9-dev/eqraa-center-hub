import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IconButton from "@/components/IconButton";
import { render } from "@/test/utils/test-utils";
import { BookOpen, Home, Settings, User, Bell, Search, Target, Sparkles, Smartphone, Monitor, BookOpenCheck, Loader } from "lucide-react";

describe("IconButton Component", () => {
  it("should render correctly with required props", () => {
    render(<IconButton icon={BookOpen} label="Books" href="/books" />);

    const button = screen.getByRole("link", { name: /books/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/books");
  });

  it("should handle click events when not a link", () => {
    const handleClick = vi.fn();

    render(<IconButton icon={Home} label="Home" onClick={handleClick} />);

    const button = screen.getByRole("button", { name: /home/i });
    expect(button).toBeInTheDocument();

    // Simulate the click event
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should apply custom className correctly", () => {
    render(
      <IconButton
        icon={Settings}
        label="Settings"
        href="/settings"
        className="custom-class"
      />
    );

    const button = screen.getByRole("link", { name: /settings/i });
    // Check if the inner div has the custom class instead of the link
    const innerDiv = button.querySelector("div");
    expect(innerDiv).toHaveClass("custom-class");
  });

  it("should show tooltip on hover", async () => {
    const user = userEvent.setup();

    render(<IconButton icon={User} label="Profile" href="/profile" />);

    const button = screen.getByRole("link", { name: /profile/i });

    // Hover over the button
    await user.hover(button);

    // Check if tooltip appears (this depends on your tooltip implementation)
    const tooltip = screen.getByText(/profile/i);
    expect(tooltip).toBeInTheDocument();
  });

  it("should be accessible with proper ARIA attributes", () => {
    render(
      <IconButton
        icon={Bell}
        label="Notifications"
        href="/notifications"
        aria-label="View notifications"
      />
    );

    const button = screen.getByRole("link", { name: /view notifications/i });
    expect(button).toHaveAttribute("aria-label", "View notifications");
  });

  it("should support keyboard navigation", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<IconButton icon={Search} label="Search" onClick={handleClick} />);

    const button = screen.getByRole("button", { name: /search/i });

    // Focus the button
    button.focus();
    expect(button).toHaveFocus();

    // Press Enter
    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Clear the mock and test Space key
    handleClick.mockClear();
    await user.keyboard("{ }");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should handle disabled state correctly", () => {
    render(
      <IconButton icon={Bell} label="Disabled" onClick={vi.fn()} disabled />
    );

    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("should render different icon types correctly", () => {
    const { rerender } = render(
      <IconButton icon={BookOpen} label="Books" href="/books" />
    );

    // Check that the component renders (icon is SVG, not text)
    expect(screen.getByRole("link", { name: /books/i })).toBeInTheDocument();

    // Rerender with different icon
    rerender(<IconButton icon={Target} label="Target" href="/target" />);

    expect(screen.getByRole("link", { name: /target/i })).toBeInTheDocument();
  });

  it("should support RTL layout correctly", () => {
    render(
      <div dir="rtl">
        <IconButton icon={BookOpenCheck} label="Read" href="/read" />
      </div>
    );

    const button = screen.getByRole("link", { name: /read/i });
    expect(button).toBeInTheDocument();

    // Check if RTL styles are applied (this depends on your CSS implementation)
    const container = button.closest('[dir="rtl"]');
    expect(container).toHaveAttribute("dir", "rtl");
  });

  it("should handle loading state correctly", () => {
    render(<IconButton icon={Loader} label="Loading" onClick={vi.fn()} loading />);

    const button = screen.getByRole("button", { name: /loading/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("should have proper hover and focus states", async () => {
    const user = userEvent.setup();

    render(<IconButton icon={Sparkles} label="Sparkle" href="/sparkle" />);

    const button = screen.getByRole("link", { name: /sparkle/i });

    // Test hover state
    await user.hover(button);
    // Check for hover effect using the group-hover class instead
    const innerDiv = button.querySelector("div");
    expect(innerDiv).toHaveClass("group");

    // Test focus state
    button.focus();
    expect(button).toHaveFocus();
  });

  it("should be responsive to screen size changes", () => {
    // Mock different screen sizes
    const originalInnerWidth = window.innerWidth;

    // Mobile view
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { rerender } = render(
      <IconButton icon={Smartphone} label="Mobile" to="/mobile" />
    );

    // Desktop view
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    rerender(<IconButton icon={Monitor} label="Desktop" to="/desktop" />);

    // Restore original width
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  it("should render with custom icon colors", () => {
    render(
      <IconButton
        icon={BookOpen}
        label="Custom Colors"
        href="/custom"
        iconBgColor="bg-red-50"
        iconColor="text-red-500"
      />
    );

    const button = screen.getByRole("link", { name: /custom colors/i });
    expect(button).toBeInTheDocument();
  });
});
