# Homepage Documentation for Testsprite

## Overview

This document describes the homepage of Fatima Al-Zahra Institute for Islamic Sciences, which is accessible at `localhost:3000`.

## Page Structure

The homepage (`src/pages/Index.tsx`) serves as the main navigation hub for the institute's web application.

### Header

- **Title**: "معهد فاطمة الزهراء" (Fatima Al-Zahra Institute)
- **No back button** (showBack={false}) as this is the root page

### Main Content

- **Welcome Message**: "مرحباً بك في معهد فاطمة الزهراء للعلوم الشرعية" (Welcome to Fatima Al-Zahra Institute for Islamic Sciences)
- **Subtitle**: "اختر القسم المناسب للبدء" (Choose the appropriate section to begin)

### Navigation Grid

The homepage features a responsive grid layout with the following sections:

| Icon | Section                              | Route            | Description                  |
| ---- | ------------------------------------ | ---------------- | ---------------------------- |
| 👥   | الإدارة (Administration)             | `/admin`         | Administrative functions     |
| 📖   | القرآن (Quran)                       | `/quran`         | Quran-related activities     |
| 🎯   | التجويد (Tajweed)                    | `/tajweed`       | Tajweed studies and practice |
| 📚   | التربوي (Educational)                | `/educational`   | Educational programs         |
| 📝   | الامتحانات (Exams)                   | `/exams`         | Examination management       |
| 📚   | المواد الدراسية (Subjects)           | `/subjects`      | Academic subjects            |
| 📅   | الجدول الدراسي (Schedule)            | `/schedule`      | Class schedules              |
| 📊   | الحضور والانصراف (Attendance)        | `/attendance`    | Attendance tracking          |
| 🧑‍🎓   | الطلاب (Students)                    | `/students`      | Student management           |
| 🧑‍🏫   | المدرسون (Teachers)                  | `/teachers`      | Teacher management           |
| 🕌   | حلقات القرآن (Quran Circles)         | `/quran-circles` | Quran study circles          |
| 📢   | الإعلانات (Announcements)            | `/announcements` | Institute announcements      |
| 🧭   | المكتبة العلمية (Scientific Library) | `/library`       | Digital library              |
| ⚙️   | الإعدادات (Settings)                 | `/settings`      | Application settings         |
| 🤝   | الاجتماعات (Meetings)                | `/meetings`      | Meeting management           |
| 💡   | المقترحات (Suggestions)              | `/suggestions`   | Suggestion box               |

### Footer

- **Copyright**: © {current year} معهد فاطمة الزهراء للعلوم الشرعية - جميع الحقوق محفوظة
- (Fatima Al-Zahra Institute for Islamic Sciences - All rights reserved)

## Technical Implementation

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Components**:
  - `PageHeader` for the header section
  - `IconButton` for navigation items
- **Responsive Design**: Grid layout adapts from 1 column (mobile) to 4 columns (extra large screens)

## Testing Notes for Testsprite

- The page should be fully responsive across different screen sizes
- All navigation buttons should be clickable and lead to their respective routes
- The grid layout should maintain proper spacing and alignment
- Icons should render correctly in all browsers
- The footer should always appear at the bottom of the page
- Text should be properly aligned and readable in Arabic (RTL support)

## Accessibility

- Semantic HTML structure with proper heading hierarchy
- Interactive elements are keyboard accessible
- Clear visual hierarchy with proper contrast ratios
