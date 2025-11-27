# Homepage Test Specification - Eqraa Center Hub

## Test Objective
Verify that the homepage (Index page) of the Eqraa Center Hub loads correctly, displays all required elements, and provides proper navigation functionality.

## Application Under Test
- **URL**: http://localhost:8080/
- **Page**: Homepage (Index.tsx)
- **Institute Name**: معهد فاطمة الزهراء

## Test Scenarios

### 1. Page Load and Structure

#### Test Case 1.1: Page Loads Successfully
**Priority**: Critical
**Steps**:
1. Navigate to http://localhost:8080/
2. Verify page loads without errors
3. Check that the page has proper HTML structure

**Expected Results**:
- Page loads within 5 seconds
- No console errors
- Page contains header, main content, and footer

#### Test Case 1.2: Page Header Display
**Priority**: Critical
**Steps**:
1. Navigate to homepage
2. Locate the page header component
3. Verify header text

**Expected Results**:
- Header displays "معهد فاطمة الزهراء"
- Header is visible at the top of the page
- Back button should NOT be visible (since this is the root page)

### 2. Welcome Section

#### Test Case 2.1: Welcome Message Display
**Priority**: High
**Steps**:
1. Navigate to homepage
2. Locate the welcome section
3. Verify main heading text
4. Verify subheading text

**Expected Results**:
- Main heading displays: "مرحباً بك في معهد فاطمة الزهراء للعلوم الشرعية"
- Subheading displays: "اختر القسم المناسب للبدء"
- Text is properly centered
- Text is visible and readable

### 3. Navigation Grid

#### Test Case 3.1: All Navigation Buttons Display
**Priority**: Critical
**Steps**:
1. Navigate to homepage
2. Count the number of navigation buttons
3. Verify all buttons are visible

**Expected Results**:
- Exactly 16 navigation buttons are displayed
- All buttons are visible in the viewport (may require scrolling on mobile)
- Grid layout is properly formatted

#### Test Case 3.2: Navigation Button Content
**Priority**: Critical
**Steps**:
1. Navigate to homepage
2. For each navigation button, verify:
   - Icon is displayed
   - Label text is displayed in Arabic
   - Button is clickable

**Expected Buttons** (in order):
1. 👥 الإدارة
2. 📖 القرآن
3. 🎯 التجويد
4. 📚 التربوي
5. 📝 الامتحانات
6. 📚 المواد الدراسية
7. 📅 الجدول الدراسي
8. 📊 الحضور والانصراف
9. 🧑‍🎓 الطلاب
10. 🧑‍🏫 المدرسون
11. 🕌 حلقات القرآن
12. 📢 الإعلانات
13. 🧭 المكتبة العلمية
14. ⚙️ الإعدادات
15. 🤝 الاجتماعات
16. 💡 المقترحات

#### Test Case 3.3: Navigation Button Routing
**Priority**: Critical
**Steps**:
1. Navigate to homepage
2. Click on each navigation button
3. Verify correct route is navigated to

**Expected Routes**:
- الإدارة → /admin
- القرآن → /quran
- التجويد → /tajweed
- التربوي → /educational
- الامتحانات → /exams
- المواد الدراسية → /subjects
- الجدول الدراسي → /schedule
- الحضور والانصراف → /attendance
- الطلاب → /students
- المدرسون → /teachers
- حلقات القرآن → /quran-circles
- الإعلانات → /announcements
- المكتبة العلمية → /library
- الإعدادات → /settings
- الاجتماعات → /meetings
- المقترحات → /suggestions

### 4. Footer Section

#### Test Case 4.1: Footer Display
**Priority**: Medium
**Steps**:
1. Navigate to homepage
2. Scroll to bottom of page
3. Locate footer element
4. Verify copyright text

**Expected Results**:
- Footer is visible at bottom of page
- Copyright text includes: "معهد فاطمة الزهراء للعلوم الشرعية"
- Copyright text includes: "جميع الحقوق محفوظة"
- Current year is displayed (2025)

### 5. Responsive Design

#### Test Case 5.1: Mobile View (375px width)
**Priority**: High
**Steps**:
1. Set viewport to 375px x 667px (iPhone SE)
2. Navigate to homepage
3. Verify grid displays 2 columns
4. Verify all content is visible
5. Verify no horizontal scrolling

**Expected Results**:
- Navigation grid shows 2 columns
- All buttons are accessible
- Text is readable
- No content overflow

#### Test Case 5.2: Tablet View (768px width)
**Priority**: High
**Steps**:
1. Set viewport to 768px x 1024px (iPad)
2. Navigate to homepage
3. Verify grid displays 2-3 columns
4. Verify layout is optimized for tablet

**Expected Results**:
- Navigation grid shows 2-3 columns
- Proper spacing between elements
- Good use of available space

#### Test Case 5.3: Desktop View (1920px width)
**Priority**: High
**Steps**:
1. Set viewport to 1920px x 1080px
2. Navigate to homepage
3. Verify grid displays 4 columns
4. Verify content is centered with max-width

**Expected Results**:
- Navigation grid shows 4 columns
- Content is centered
- Proper maximum width constraint
- Adequate spacing

### 6. Accessibility

#### Test Case 6.1: RTL (Right-to-Left) Support
**Priority**: High
**Steps**:
1. Navigate to homepage
2. Inspect text direction
3. Verify Arabic text flows from right to left

**Expected Results**:
- Page has RTL direction
- Arabic text aligns to the right
- Layout mirrors properly for RTL

#### Test Case 6.2: Keyboard Navigation
**Priority**: Medium
**Steps**:
1. Navigate to homepage
2. Use Tab key to navigate through buttons
3. Verify focus indicators are visible
4. Press Enter on focused button

**Expected Results**:
- All interactive elements can be focused with keyboard
- Focus indicators are clearly visible
- Enter key activates the focused button
- Tab order is logical

#### Test Case 6.3: Color Contrast
**Priority**: Medium
**Steps**:
1. Navigate to homepage
2. Check color contrast ratios for all text elements
3. Verify readability in both light and dark modes

**Expected Results**:
- Text has sufficient contrast (WCAG AA minimum: 4.5:1 for normal text)
- Icons are clearly visible
- Buttons have clear visual boundaries

### 7. Theme Support

#### Test Case 7.1: Light Mode
**Priority**: Medium
**Steps**:
1. Set application to light mode
2. Navigate to homepage
3. Verify all elements are visible and properly styled

**Expected Results**:
- Light background
- Dark text for readability
- Proper color scheme applied
- All elements visible

#### Test Case 7.2: Dark Mode
**Priority**: Medium
**Steps**:
1. Set application to dark mode
2. Navigate to homepage
3. Verify all elements are visible and properly styled

**Expected Results**:
- Dark background
- Light text for readability
- Proper color scheme applied
- All elements visible

### 8. Performance

#### Test Case 8.1: Page Load Time
**Priority**: Medium
**Steps**:
1. Clear cache and reload homepage
2. Measure time to interactive
3. Check network requests

**Expected Results**:
- Page loads in under 3 seconds
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- No unnecessary network requests

#### Test Case 8.2: Resource Loading
**Priority**: Low
**Steps**:
1. Navigate to homepage
2. Check all resources load successfully
3. Verify no 404 errors in console

**Expected Results**:
- All JavaScript files load successfully
- All CSS files load successfully
- Font files load properly
- No console errors

## Test Data Requirements

### Required Application State
- Application should be running on http://localhost:8080
- No authentication required for homepage
- Fresh application state (no cached data needed)

### Browser Support
- Chrome (Desktop & Mobile)
- Firefox (Desktop)
- Safari/WebKit (Desktop & Mobile)

## Test Environment
- **Development Server**: npm run dev
- **Test Framework**: Playwright
- **Base URL**: http://localhost:8080

## Success Criteria
- All Critical priority tests pass: 100%
- All High priority tests pass: ≥ 95%
- All Medium priority tests pass: ≥ 90%
- All Low priority tests pass: ≥ 80%

## Notes
- Tests should be run in both light and dark modes
- Mobile tests should include both portrait and landscape orientations
- Arabic text rendering should be verified on all platforms
- Navigation tests should verify that routes exist (may show "coming soon" or 404)

---

**Created**: 2025-11-22
**Version**: 1.0
**Test Type**: End-to-End (E2E)
