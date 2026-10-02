# Styling (Tailwind)

- Style with Tailwind utility classes. No CSS modules or inline `style` unless a value is truly dynamic.
- Design tokens (colors, radii, fonts, spacing scale) are defined once in the Tailwind theme / CSS variables. Never hardcode hex values or arbitrary pixel sizes in components when a token exists.
- Merge conditional classes with a `cn()` helper (`clsx` + `tailwind-merge`, added together with the first shared components), not string concatenation.
- Component variants go through a variant helper (`cva`), not ad-hoc ternaries spread across the JSX.
- Mobile first: base classes target small screens, `sm:`/`md:`/`lg:` add on top.
- Dark mode is supported from day one via the `dark:` variant and CSS variables.
- Keep class order consistent — the Prettier Tailwind plugin sorts them (once Prettier is set up); do not fight it.

## Accessibility

- Interactive elements are real `<button>` / `<a>` elements, never clickable `<div>`s.
- Every input has a label; every image has meaningful `alt` (or `alt=""` if decorative).
- Visible focus styles on everything focusable (`focus-visible:` ring).
- Color contrast meets WCAG AA in both themes.
