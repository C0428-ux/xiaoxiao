# Interaction Patterns Guide | Interaction Patterns

## Core Objective

Provide common user interaction patterns to ensure consistency and usability.

## Form Interactions

### Real-time Validation

```markdown
1. User input → Instant validation → Show result
   ✓ Format correct / ✗ Format error

2. Error message below input
3. Prompt on first error, don't wait for submit
```

### Required Markers

```markdown
✓ Required: Add * after label
✓ Optional: Add (optional) after label
```

### Submit States

```markdown
Before click: [Submit button]
During click: [Submitting...]
After click: [Submit successful ✓] → Redirect

On error: [Stay in place, show error message]
```

## Navigation Interactions

### Page Navigation

```markdown
Click link → Previous page loads → New page loads
         ↓
    Show loading state
```

### Tab Switching

```markdown
[Tab1] [Tab2] [Tab3]
───────────────────
Content area 1
```

### Dropdown Menu

```markdown
Click trigger → Show menu → Select → Close menu
                    ↓
              Click outside also closes
```

## List Interactions

### Load More

```markdown
List content...
List content...
List content...
      ↓ Scroll to bottom
[Load more...]
```

### Pull to Refresh

```markdown
↓ Continue pulling to refresh...
↓
[Release to refresh...]
↓
[Refreshing...]
↓
✓ Refresh complete
```

### Batch Operations

```markdown
☐ Select 1
☐ Select 2
☐ Select 3
──────────
[Batch delete] [Batch move]
(shown when selected items > 0)
```

## Feedback Interactions

### Toast Notifications

| Type | Purpose | Display Duration |
|------|---------|------------------|
| Success | Operation successful | 2 seconds |
| Error | Operation failed | 5 seconds |
| Warning | Needs attention | 3 seconds |
| Loading | Async operation in progress | Until complete |

### Modal Dialog

```markdown
Show modal → User action → Close modal
              ↓
         Confirm/Cancel
```

### Confirmation Dialog

```markdown
┌─────────────────────────────┐
│ Confirm deletion?           │
│                             │
│ Cannot recover after        │
│ deletion                    │
│                             │
│    [Cancel]      [Delete]   │
└─────────────────────────────┘
```

## Gesture Interactions

| Gesture | Action | Scenario |
|---------|--------|----------|
| Tap | Select/trigger | Primary action |
| Long press | Show more | Context menu |
| Swipe | Quick action | List item actions |
| Drag | Move/sort | Drag to reorder |
| Pinch | Zoom | Images/maps |

## Keyboard Interactions

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Enter | Confirm/submit |
| Escape | Cancel/close |
| Tab | Next input field |
| Shift+Tab | Previous input field |

### Focus Management

```markdown
Open modal → Focus moves into modal
Close modal → Focus returns to trigger element
```

## Loading States

### Global Loading

```markdown
[Show loading overlay on request]

Transparent overlay + centered spinner
Clicks disabled
```

### Local Loading

```markdown
[Button spinner]
[Area placeholder + spinner]
[Content area skeleton]
```

## Error Handling

### Form Errors

```markdown
1. Validate in real-time as user types
2. Check all fields on submit
3. Error message below field
4. First error field gets focus
```

### Network Errors

```markdown
Request failed
   ↓
Show error message + retry button
   ↓
User can choose to retry or cancel
```

## When to Exit

- All core interactions defined
- Edge cases handled
- User experience flow is smooth
- Development can implement from documentation