# Component Patterns | Component Patterns

20+ best practices for core components. Reference [component.gallery](https://component.gallery) and industry standards.

---

## Button | Button

**When to use**: Primary entry point for triggering actions

**Best practices**:
- Labels start with verbs: "Save changes" not "Submit"
- Only one primary button per section
- No more than 3 buttons on the same row
- Icon buttons need tooltip explanation

**States**:
| State | Style |
|-------|-------|
| Default | Base color |
| Hover | 10% darker |
| Active | 20% darker, slight shrink |
| Disabled | 50% opacity |
| Loading | Text replaced with spinner |

**Variants**:
- **Primary**: Filled background, primary color
- **Secondary**: Border, transparent background
- **Ghost**: Text only, no border
- **Danger**: Red, for delete and other dangerous operations

**Anti-patterns**:
- "Click here" or "Submit" as labels
- 4+ buttons on the same row
- Multiple primary buttons

---

## Input | Input

**When to use**: Collecting user text input

**Best practices**:
- Labels above input (vertical forms scan faster)
- Placeholder only as format hint, not replacement for labels
- Real-time validation (on blur), not character-by-character
- Required indicator uses asterisk (*) not "Required"

**States**:
| State | Style |
|-------|-------|
| Default | Gray border |
| Focus | Accent color border, ring |
| Error | Red border + error message |
| Disabled | Gray background |

**Variants**:
- Text input (single line)
- Textarea (multi-line)
- Search input (with search icon)
- Password (with show/hide toggle)

**Anti-patterns**:
- Placeholder replacing labels
- Border color has no contrast with background
- Labels on the right of input (mobile)

---

## Card | Card

**When to use**: Displaying independent content blocks

**Best practices**:
- Content hierarchy: Media → Title → Meta → Action
- Cards have border OR shadow, not both
- Consistent spacing between cards
- Click areas must be clear (entire card clickable? Or explicit CTA?)

**Structure**:
```html
<article class="card">
  <img src="..." alt="..." />  <!-- optional -->
  <h3>Title</h3>
  <p class="meta">2 hours ago</p>  <!-- optional -->
  <button>Action</button>
</article>
```

**Anti-patterns**:
- Multiple primary buttons
- Using both border and shadow
- Card content misaligned

---

## Modal | Modal

**When to use**: When user needs to focus on one thing

**Best practices**:
- X close button in top right
- Provide Cancel button
- Support Escape key to close
- Trap focus when open, restore focus on close
- Click on overlay to close (optional)

**Structure**:
```html
<div class="modal-overlay">
  <div class="modal" role="dialog">
    <header>
      <h2>Title</h2>
      <button aria-label="Close">×</button>
    </header>
    <div class="modal-body">
      <!-- content -->
    </div>
    <footer>
      <button>Cancel</button>
      <button class="primary">Confirm</button>
    </footer>
  </div>
</div>
```

**Anti-patterns**:
- Nested modals (use Drawer instead)
- No way to close
- Blocks user without providing information

---

## Navigation | Navigation

**When to use**: Switching between pages or areas

**Best practices**:
- Maximum 5-7 main items
- Current page/area needs active state
- Logo links to homepage
- Mobile uses hamburger menu or bottom tabs

**Variants**:
- Top nav (suitable for 3-5 items)
- Sidebar (suitable for 5+ items)
- Tabs (suitable for different panels on same page)
- Breadcrumbs (suitable for deep hierarchy pages)

**Anti-patterns**:
- Desktop uses hamburger menu
- More than 7 navigation items without organization
- No active state indicator

---

## Table | Table

**When to use**: Displaying structured data, needing comparison and sorting

**Best practices**:
- Sticky header
- Numbers right-aligned
- Sortable columns
- Row hover highlight
- Optional: pagination or infinite scroll

**Structure**:
```html
<table>
  <thead>
    <tr>
      <th>Name <sort-indicator /></th>
      <th class="num">Amount</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Project A</td>
      <td class="num">$12,400</td>
      <td><badge>Active</badge></td>
    </tr>
  </tbody>
</table>
```

**Anti-patterns**:
- No sticky header, lose column names after scroll
- Plain text without formatting
- Cell content without ellipsis

---

## Form | Form

**When to use**: Collecting user input and submitting

**Best practices**:
- Single column layout scans faster
- Required fields marked with asterisk (*)
- Error messages shown inline
- Submit button shows reason when disabled
- Success/failure feedback is clear

**Flow**:
1. Display form
2. User fills in
3. Validate (on blur)
4. Submit
5. Show result

**Anti-patterns**:
- Multi-column layout (causes eye jumping)
- No feedback after submit
- Inconsistent validation message positions

---

## Toast | Toast

**When to use**: Brief confirmation after successful operation

**Best practices**:
- Auto dismiss after 4-6 seconds
- Allow manual close
- Destructive operations provide Undo
- New messages stack at top
- Position: top right or bottom

**Structure**:
```html
<div class="toast" role="alert">
  <icon />
  <span>Project saved</span>
  <button aria-label="Dismiss">×</button>
</div>
```

**Anti-patterns**:
- Stay longer than 10 seconds
- Cannot manually close
- Dangerous operations without Undo
- Cover important content

---

## Alert | Alert

**When to use**: Displaying important status information to user

**Best practices**:
- Use semantic colors (success/error/warning/info)
- Maximum 1-2 sentences
- Use icons to enhance recognition
- Optional action buttons

**Variants**:
- **Success**: Green, for successful operations
- **Error**: Red, for error messages, needs resolution
- **Warning**: Yellow/orange, for warnings
- **Info**: Blue, for general information

**Anti-patterns**:
- Semantic colors used for decoration
- More than 3 lines of text
- Multiple Alerts stacked

---

## Badge | Badge

**When to use**: Status labels, metadata

**Best practices**:
- 1-2 words
- Pill shape for status
- No more than 3 colors (to distinguish different states)
- Sufficient contrast with context

**Variants**:
- **Status badges**: Active, Pending, Archived
- **Count badges**: Number count
- **Tag badges**: Category tags

**Anti-patterns**:
- Rainbow colors (each state a bright color)
- More than 3 words
- Border has no contrast with background

---

## Empty State | Empty State

**When to use**: When list/data is empty

**Best practices**:
- Provide illustration or icon
- Use positive language ("No projects yet, create your first one" not "No data")
- Provide CTA button to guide user action

**Structure**:
```html
<div class="empty-state">
  <icon illustration />
  <h3>No projects yet</h3>
  <p>Create your first project to get started</p>
  <button>New Project</button>
</div>
```

**Anti-patterns**:
- "No data" plain text
- No guidance for next step
- Negative tone

---

## Loading | Loading State

**When to use**: While content is loading

**Best practices**:
- Skeleton is better than Spinner (show after 300ms delay)
- Skeleton should match actual layout
- Spinner for buttons or small areas
- Provide loading progress percentage (if calculable)

**Skeleton Example**:
```html
<div class="skeleton">
  <div class="skeleton-line" style="width: 60%"></div>
  <div class="skeleton-line" style="width: 80%"></div>
  <div class="skeleton-line" style="width: 40%"></div>
</div>
```

**Anti-patterns**:
- Spinner for content with predictable layout
- Skeleton doesn't match actual content layout
- No loading state (content flickers)

---

## Dropdown | Dropdown

**When to use**: Selection list, action menu

**Best practices**:
- Menu items 7±2 (matches cognition)
- Dangerous operations at the end, in red
- Support keyboard navigation (up/down arrows + Enter)
- Click outside or Escape to close

**Structure**:
```html
<div class="dropdown">
  <button aria-haspopup="true">Options</button>
  <ul class="dropdown-menu" role="menu">
    <li><button role="menuitem">Edit</button></li>
    <li><button role="menuitem">Duplicate</button></li>
    <li class="divider"></li>
    <li><button role="menuitem" class="danger">Delete</button></li>
  </ul>
</div>
```

**Anti-patterns**:
- More than 10 menu items (use grouping or search instead)
- No keyboard navigation
- Dangerous operations at the top of the list

---

## Tabs | Tabs

**When to use**: Switching different panels on the same page

**Best practices**:
- 2-7 Tabs
- Active state has visual indicator (underline or background)
- Mobile collapses to Accordion or Scroll
- Tab content lazy loads

**Anti-patterns**:
- More than 7 Tabs
- No active state indicator
- Tab content unrelated to each other

---

## Drawer | Drawer

**When to use**: Secondary panels, detail sidebars

**Best practices**:
- Slide in from right (detail panel)
- Slide in from left (auxiliary navigation)
- Width 320-480px (desktop)
- Click outside or X to close

**Anti-patterns**:
- Covers entire page
- Confused with Modal

---

## Avatar | Avatar

**When to use**: User identification

**Best practices**:
- Round or rounded square
- Provide fallback (initials or default image)
- Multiple avatars stack display
- Support online/offline status indicator

**Sizes**:
- sm: 24-32px (in lists)
- md: 40-48px (default)
- lg: 64-80px (profile page)

---

## Tooltip | Tooltip

**When to use**: Explanation for icon buttons

**Best practices**:
- Delay display 200-300ms
- Hover above trigger element
- Text is brief (1-2 sentences)
- Not for critical information

**Anti-patterns**:
- Critical information only in Tooltip
- No delay, triggers frequently
- Text more than 3 lines

---

## Layout Patterns

### Single Column Layout
Applicable: Forms, detail pages, registration/login

### Two Column Layout
Applicable: Dashboard, list + detail

```
[Sidebar 240px] [Content fluid]
```

### Three Column Layout
Applicable: Email, complex Dashboard

```
[Nav 240px] [Content fluid] [Detail 320px]
```

### Grid Layout
Applicable: Card lists, albums, product lists

```
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
```

---

## Component Composition Rules

### Form + Card
```
Card
  Header: Title + Action button
  Body: Form
    Input groups
    Validation messages
  Footer: Cancel + Submit
```

### List + Pagination
```
Container
  Header: Title + New button
  Filter bar (optional)
  Table / Card list
  Pagination / Load more
```

### Dashboard Layout
```
Dashboard
  KPI Cards row
  Chart row
  Table / List row
```

---

## Quick Reference Table

| Need | Component |
|------|-----------|
| Trigger action | Button |
| Collect input | Input, Form, Select |
| Display content | Card, Table, Badge, Avatar |
| Navigation | Navigation, Tabs, Breadcrumbs |
| Feedback | Toast, Alert, Modal |
| State | Empty State, Loading, Skeleton |
| Organization | Drawer, Dropdown, Tooltip |