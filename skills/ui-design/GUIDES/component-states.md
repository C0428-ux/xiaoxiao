# Component States Guide | Component States

## Core Objective

Fully define all component states to ensure consistency between design and development.

## Common States

| State | Description | Visual Expression |
|-------|-------------|-------------------|
| Default | Default state | Normal style |
| Hover | Mouse over | Darker color/shadow |
| Active/Pressed | Clicking | Darker color/scale |
| Focus | Gained focus | Border highlight |
| Disabled | Disabled | Semi-transparent/unclickable |
| Loading | Loading | Animation/placeholder |

## Button States

```markdown
### Default
[Primary Action]

### Hover
[Mouse over - background 10% darker]

### Active/Pressed
[Clicking - background 20% darker]

### Focus
[Gained focus - blue border]

### Disabled
[Disabled - 50% opacity]

### Loading
[Loading - show spinner]
```

## Input States

```markdown
### Default
+--------------------+
| Input content...   |
+--------------------+

### Focus
+--------------------+
| |Input content...  |  <- blue border
+--------------------+

### Error
+--------------------+
| X Please enter email|  <- red border + error message
+--------------------+

### Disabled
+--------------------+
|   Non-editable     |  <- gray background
+--------------------+
```

## Card States

```markdown
### Default
+------------------------+
| Title                  |
| Description...         |
+------------------------+

### Hover
+------------------------+
| Title                  |  <- shadow deepens
| Description...         |
+------------------------+

### Selected
+========================+
== Title                  == <- border highlight
| Description...         |
+========================+
```

## List Item States

```markdown
### Default
+------------------------+
| ○ Option A             |
+------------------------+

### Hover
+------------------------+
| ○ Option A             |  <- background color change
+------------------------+

### Selected
+------------------------+
| ● Option B             |  <- selected indicator
+------------------------+

### Disabled
+------------------------+
| ○ Option C             |  <- gray text
+------------------------+
```

## Loading States

### Skeleton

```markdown
+------------------------+
| [████████░░] Title      |
| [██████░░░░] Description|
+------------------------+
```

### Spinner

```markdown
Loading...
[ ◐ ] [ ◑ ] [ ◒ ] [ ◓ ]  (rotation animation)
```

### Progress

```markdown
[████████░░░░░░░░░] 50%
```

## Empty State

```markdown
+------------------------+
|                        |
|      [Icon]            |
|                        |
|   No data yet          |
|   Description text     |
|                        |
|   [Action button]      |
|                        |
+------------------------+
```

## Error State

```markdown
+------------------------+
|                        |
|      [Warning icon]    |
|                        |
|   Something went wrong |
|   [Error details]      |
|                        |
|   [Retry button]       |
|                        |
+------------------------+
```

## State Transitions

| From \ To | Default | Hover | Active | Disabled |
|-----------|---------|-------|--------|----------|
| Default | - | Mouse enter | Click | Set attribute |
| Hover | Mouse leave | - | Click | Set attribute |
| Active | Release | Maintain | - | Lose focus |
| Disabled | - | - | - | - |

## When to Exit

- All component states fully defined
- Transition logic documented
- Edge cases handled
- Ready for development implementation