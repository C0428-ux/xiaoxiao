# Accessibility Design Guide | Accessibility

## Core Objective

Ensure the product is accessible to all users, including people with disabilities.

## WCAG 2.1 AA Standards

| Principle | Description |
|-----------|-------------|
| Perceivable | Information and components are perceivable by users |
| Operable | Users can operate the interface |
| Understandable | Information and interface operations are understandable |
| Robust | Content can be interpreted in multiple ways |

## Visual Accessibility

### Color Contrast

```markdown
## Text Contrast

| Scenario | Minimum Contrast |
|----------|------------------|
| Normal text | 4.5:1 |
| Large text (18px+) | 3:1 |
| UI components and graphics | 3:1 |

## Checking Tools
- WebAIM Contrast Checker
- Figma Contrast plugin
```

### Do Not Rely on Color Alone

```markdown
# Wrong
Status: Red = Error, Green = Success

# Correct
Status: Red + Icon + Text explanation
```

## Keyboard Accessibility

### Focus Visibility

```markdown
/* Focus styles */
:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

### Focus Order

```markdown
Tab order = Visual logical order
1 → 2 → 3 → 4 (follows reading order)
```

### Keyboard Shortcuts

```markdown
| Shortcut | Action |
|----------|--------|
| Tab | Next focus |
| Shift+Tab | Previous focus |
| Enter | Activate button/link |
| Escape | Close modal/cancel |
| Space | Activate button |
```

## Screen Reader Support

### Semantic Tags

```markdown
<button> Button (auto announced)
<a href> Link (auto announced)
<h1>-<h6> Heading (hierarchical structure)
<input> Input field (auto announces label)
```

### ARIA Attributes

```markdown
## Required Attributes
aria-label="Close button"
aria-describedby="error-message"
aria-required="true"

## State Attributes
aria-expanded="true/false"
aria-selected="true/false"
aria-disabled="true/false"
aria-hidden="true"
```

### Image Descriptions

```markdown
<img src="chart.png" alt="December sales growth chart showing 20% increase">
<img src="icon.png" alt=""> (decorative images use alt="")
```

## Form Accessibility

### Label Association

```markdown
<label for="email">Email</label>
<input id="email" type="email">

<!-- or -->
<label>
  Email
  <input type="email">
</label>
```

### Error Messages

```markdown
<input id="password" aria-describedby="password-hint" aria-invalid="true">
<span id="password-hint">Password must be at least 8 characters</span>
```

## Dynamic Content Accessibility

### Live Updates

```markdown
<!-- Notify screen reader when page updates -->
<div aria-live="polite" aria-atomic="true">
  New content loaded
</div>
```

### Loading States

```markdown
<!-- Tell screen reader it's loading -->
<div role="status" aria-label="Loading">
  Loading...
</div>
```

## Checklist

### Visual
- [ ] Color contrast meets standards
- [ ] Do not rely on color alone
- [ ] Support 200% zoom

### Keyboard
- [ ] All functions are keyboard accessible
- [ ] Focus styles are visible
- [ ] Focus order is logical

### Screen Reader
- [ ] All images have alt text
- [ ] Forms have labels
- [ ] ARIA is used correctly
- [ ] Dynamic content has notifications

### Testing
- [ ] Test with images disabled
- [ ] Keyboard-only testing
- [ ] Screen reader testing

## Common Tools

| Tool | Purpose |
|------|---------|
| axe DevTools | Automatic issue detection |
| WAVE | Web accessibility evaluation |
| NVDA (Windows) | Screen reader |
| VoiceOver (Mac) | Screen reader |

## When to Exit

- No high-severity issues detected by axe DevTools
- Keyboard operation works through complete flow
- Screen reader can read main content
- Color contrast meets AA standards