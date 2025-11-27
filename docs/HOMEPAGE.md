# Homepage Documentation - Eqraa Center Hub

## Overview

The homepage (`src/pages/Index.tsx`) serves as the main landing page and navigation hub for the Eqraa Center Hub application. It provides users with a centralized access point to all major sections of the Islamic educational center management system.

## Page Title

**معهد فاطمة الزهراء** (Fatima Al-Zahra Institute)

## Page Structure

### 1. Header Section
- **Component**: `PageHeader`
- **Title**: معهد فاطمة الزهراء
- **Back Navigation**: Disabled (since this is the root page)

### 2. Welcome Section
- **Main Heading**: "مرحباً بك في معهد فاطمة الزهراء للعلوم الشرعية"
  - Translation: "Welcome to Fatima Al-Zahra Institute for Islamic Sciences"
- **Subheading**: "اختر القسم المناسب للبدء"
  - Translation: "Choose the appropriate section to get started"

### 3. Navigation Grid
The homepage displays a responsive grid of navigation buttons organized into 16 main sections:

#### Section Details

| Icon | Label (Arabic) | Label (English) | Route | Purpose |
|------|---------------|-----------------|-------|---------|
| 👥 | الإدارة | Administration | `/admin` | User management, permissions, and reports |
| 📖 | القرآن | Quran | `/quran` | Quran session management and student progress |
| 🎯 | التجويد | Tajweed | `/tajweed` | Tajweed lessons and assessments |
| 📚 | التربوي | Educational | `/educational` | Educational materials and curriculum |
| 📝 | الامتحانات | Exams | `/exams` | Exam management and results |
| 📚 | المواد الدراسية | Subjects | `/subjects` | Subject/course management |
| 📅 | الجدول الدراسي | Schedule | `/schedule` | Academic scheduling |
| 📊 | الحضور والانصراف | Attendance | `/attendance` | Attendance tracking system |
| 🧑‍🎓 | الطلاب | Students | `/students` | Student management |
| 🧑‍🏫 | المدرسون | Teachers | `/teachers` | Teacher/instructor management |
| 🕌 | حلقات القرآن | Quran Circles | `/quran-circles` | Quran study circle management |
| 📢 | الإعلانات | Announcements | `/announcements` | Announcement and notification system |
| 🧭 | المكتبة العلمية | Scientific Library | `/library` | Resource library management |
| ⚙️ | الإعدادات | Settings | `/settings` | Application settings |
| 🤝 | الاجتماعات | Meetings | `/meetings` | Meeting management |
| 💡 | المقترحات | Suggestions | `/suggestions` | Suggestion and feedback system |

### 4. Footer Section
- **Copyright Notice**: © {current year} معهد فاطمة الزهراء للعلوم الشرعية - جميع الحقوق محفوظة
  - Translation: "© 2025 Fatima Al-Zahra Institute for Islamic Sciences - All Rights Reserved"

## Design System

### Layout
- **Container**: Full viewport height with background color from theme
- **Content Width**: Maximum 7xl (80rem) with auto margins for centering
- **Padding**: Responsive padding using Tailwind's responsive utilities

### Responsive Grid
The navigation buttons use a responsive grid system:

```css
grid-cols-2        /* Mobile (default) */
xs:grid-cols-2     /* Extra small screens */
sm:grid-cols-2     /* Small screens */
md:grid-cols-3     /* Medium screens */
lg:grid-cols-4     /* Large screens */
```

### Spacing
- **Gap between items**: Responsive (2 → 3 → 4 → 6)
- **Vertical spacing**: Progressive margins (4 → 6 → 8 → 12)

## Components Used

### IconButton
- **Purpose**: Navigational button with emoji icon and label
- **Props**:
  - `to`: Navigation route
  - `icon`: Emoji icon
  - `label`: Arabic text label

### PageHeader
- **Purpose**: Consistent page header across the application
- **Props**:
  - `title`: Page title
  - `showBack`: Boolean to show/hide back button

## Accessibility Features

1. **RTL Support**: Full right-to-left layout for Arabic language
2. **Responsive Design**: Mobile-first approach with progressive enhancement
3. **Semantic HTML**: Proper use of semantic elements (header, main, footer)
4. **Color Contrast**: Theme-aware colors ensuring proper contrast
5. **Touch Targets**: Large, tappable buttons optimized for mobile devices

## Theme Support

The homepage fully supports the application's dark/light theme system:
- `bg-background`: Dynamic background color
- `text-foreground`: Dynamic primary text color
- `text-muted-foreground`: Dynamic secondary text color
- `bg-card`: Dynamic card background
- `border-border`: Dynamic border color

## Typography

- **Font Family**: Noto Sans Arabic (supports full Arabic character set)
- **Text Direction**: RTL (Right-to-Left)
- **Heading Sizes**: Responsive typography scaling from mobile to desktop
  - Main heading: lg → xl → 2xl → 3xl
  - Subheading: sm → base → lg → xl
  - Footer: xs → sm → base

## User Experience

### Navigation Flow
1. User lands on the homepage
2. Views welcome message and available sections
3. Clicks on desired section button
4. Navigates to the specific feature area

### Visual Hierarchy
1. **Header**: Institute branding
2. **Welcome Message**: Clear call-to-action
3. **Navigation Grid**: Primary interface element
4. **Footer**: Copyright and legal information

## Technical Implementation

### File Location
`src/pages/Index.tsx`

### Dependencies
```typescript
import IconButton from "@/components/IconButton";
import PageHeader from "@/components/PageHeader";
```

### State Management
- **Static Data**: Section configuration is defined as a local constant
- **No External State**: The homepage is stateless and doesn't require global state management

### Routing
Uses React Router DOM for client-side navigation. Each IconButton links to its respective route.

## Future Enhancements

Potential improvements for the homepage:

1. **Dynamic Sections**: Load sections based on user permissions
2. **Quick Stats**: Display summary statistics for each section
3. **Recent Activity**: Show recent activity or notifications
4. **Search Functionality**: Quick search across all sections
5. **Favorites**: Allow users to pin frequently accessed sections
6. **Custom Layout**: Let users customize their homepage layout
7. **Announcements Banner**: Display important announcements
8. **Quick Actions**: Add shortcuts for common tasks

## Maintenance Notes

When adding new sections:
1. Add entry to the `sections` array with:
   - Unique route path
   - Appropriate emoji icon
   - Arabic label
2. Ensure the route is registered in the application router
3. Update this documentation
4. Consider grid layout balance (multiples of 2, 3, or 4 work best)

## Related Documentation

- [Project README](../README.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Project Features](../PROJECT_FEATURES.md)

---

**Last Updated**: 2025-11-22
**Version**: 1.0