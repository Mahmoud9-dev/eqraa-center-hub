import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import StatCard from "@/components/StatCard";
import { render } from "@/test/utils/test-utils";
import { School, CheckCircle, BookOpen, Calendar } from "lucide-react";

describe("StatCard Component", () => {
  it("should render correctly with required props", () => {
    render(
      <StatCard
        icon={School}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
        label="إجمالي الطلاب"
        value="1,240"
      />
    );

    expect(screen.getByText("إجمالي الطلاب")).toBeInTheDocument();
    expect(screen.getByText("1,240")).toBeInTheDocument();
  });

  it("should render numeric values correctly", () => {
    render(
      <StatCard
        icon={CheckCircle}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
        label="الحضور اليوم"
        value={98}
      />
    );

    expect(screen.getByText("الحضور اليوم")).toBeInTheDocument();
    expect(screen.getByText("98")).toBeInTheDocument();
  });

  it("should show loading state correctly", () => {
    render(
      <StatCard
        icon={BookOpen}
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
        label="الحلقات النشطة"
        value="45"
        loading={true}
      />
    );

    expect(screen.getByText("الحلقات النشطة")).toBeInTheDocument();
    // Value should not be visible when loading
    expect(screen.queryByText("45")).not.toBeInTheDocument();
    // Should have loading skeleton
    const loadingSkeleton = document.querySelector(".animate-pulse");
    expect(loadingSkeleton).toBeInTheDocument();
  });

  it("should apply custom className correctly", () => {
    const { container } = render(
      <StatCard
        icon={Calendar}
        iconBgColor="bg-orange-100"
        iconColor="text-orange-600"
        label="الاختبارات القادمة"
        value="3"
        className="custom-class"
      />
    );

    // Query for the actual StatCard element (has bg-card class)
    const card = container.querySelector('.bg-card');
    expect(card).toHaveClass("custom-class");
  });

  it("should render icon with correct styling", () => {
    render(
      <StatCard
        icon={School}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
        label="Test Label"
        value="100"
      />
    );

    // Check icon container has correct background color class
    const iconContainer = document.querySelector(".bg-blue-100");
    expect(iconContainer).toBeInTheDocument();
  });

  it("should handle percentage values correctly", () => {
    render(
      <StatCard
        icon={CheckCircle}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
        label="معدل الحضور"
        value="95%"
      />
    );

    expect(screen.getByText("95%")).toBeInTheDocument();
  });

  it("should handle zero values correctly", () => {
    render(
      <StatCard
        icon={Calendar}
        iconBgColor="bg-orange-100"
        iconColor="text-orange-600"
        label="الاختبارات القادمة"
        value={0}
      />
    );

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(
      <StatCard
        icon={School}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
        label="إجمالي الطلاب"
        value="500"
      />
    );

    // The label should be visible for screen readers
    expect(screen.getByText("إجمالي الطلاب")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
  });
});
