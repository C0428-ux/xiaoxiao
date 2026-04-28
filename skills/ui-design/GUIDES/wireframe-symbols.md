# Wireframe Symbols Guide | Wireframe Symbols

## Core Objective

Unified use of standard wireframe symbols for more efficient design communication.

## Basic Elements

### Text

```markdown
Title text
Body content
[Button]
```

### Container

```markdown
┌──────────────┐
│              │
│              │
│              │
└──────────────┘
```

### Form Elements

```markdown
┌──────────────┐
│ [Input      ] │
└──────────────┘

┌──────────────┐
│ [Selector  ▼] │
└──────────────┘

☑ Checkbox
○ Radio button
```

### Buttons

```markdown
[Primary button]
[Secondary button]
[Link text]
```

## Layout Symbols

### Page Structure

```markdown
+----------------------------------+
|  Header (Navigation bar)          |
+----------------------------------+
|        |                         |
|  Side  |     Main Content        |
|  bar   |                         |
|        |                         |
+----------------------------------+
|  Footer                         |
+----------------------------------+
```

### Grid

```markdown
+---+---+---+---+---+---+---+---+
|   |   |   |   |   |   |   |   |
+---+---+---+---+---+---+---+---+
|   |   |   |   |   |   |   |   |
+---+---+---+---+---+---+---+---+
```

## Interaction Symbols

### Click/Touch

```markdown
(○) Click target
```

### Gestures

```markdown
→ swipe right
← swipe left
↑ swipe up
↓ swipe down
⊙ long press
```

### State Changes

```markdown
A → B  (State A changes to state B)
A + B  (A and B happen simultaneously)
A | B  (A or B)
```

## Component Examples

### Navigation Bar

```markdown
+----------------------------------+
| [Logo]  Home  Product  About   [User] |
+----------------------------------+
```

### Card

```markdown
+------------------------+
|  [Image]               |
|  Title                 |
|  Description text...    |
|  $Price         [Button]|
+------------------------+
```

### List Item

```markdown
+------------------------+
| [Icon]  Title       >   |
|        Subtitle        |
+------------------------+
```

### Form

```markdown
Label
┌────────────────────┐
│ Input content...   │
└────────────────────┘

Error state
┌────────────────────┐
│ ✗ Error message    │
└────────────────────┘
```

### Modal/Dialog

```markdown
+------------------------+
|  Title              [X] |
+------------------------+
|                        |
|  Content area          |
|                        |
+------------------------+
|  [Cancel]      [Confirm] |
+------------------------+
```

### Toast Notification

```markdown
┌────────────────────┐
│ ✓ Operation successful │
└────────────────────┘
```

## Responsive Breakpoints

```markdown
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

## Color Annotations

```markdown
# Primary - Primary actions
# Secondary - Secondary actions
# Success - Success notifications
# Warning - Warning notifications
# Error - Error notifications
# Gray - Disabled/secondary info
```

## When to Exit

- All pages have wireframes
- Component states are annotated
- Interaction flows are documented
- Responsive strategies are explained