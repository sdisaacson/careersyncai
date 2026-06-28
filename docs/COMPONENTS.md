# UI Components

Catalog of all UI components used in CareerSync AI.

---

## shadcn/ui Components

Located in `src/components/ui/`. These are built on Radix UI primitives with Tailwind CSS styling.

### Layout

| Component    | File              | Description                                                        |
| ------------ | ----------------- | ------------------------------------------------------------------ |
| `Card`       | `card.tsx`        | Content container with header, title, description, content, footer |
| `Sheet`      | `sheet.tsx`       | Slide-out panel (used for mobile nav, job detail drawer)           |
| `Dialog`     | `dialog.tsx`      | Modal overlay (used for confirmations, previews)                   |
| `Drawer`     | `drawer.tsx`      | Bottom sheet panel                                                 |
| `Sidebar`    | `sidebar.tsx`     | Collapsible navigation sidebar                                     |
| `ScrollArea` | `scroll-area.tsx` | Custom scrollable container                                        |
| `Resizable`  | `resizable.tsx`   | Draggable resize panels                                            |
| `Separator`  | `separator.tsx`   | Visual divider                                                     |
| `Skeleton`   | `skeleton.tsx`    | Loading placeholder                                                |
| `Spacer`     | `spacer.tsx`      | Spacing utility                                                    |

### Navigation

| Component        | File                  | Description              |
| ---------------- | --------------------- | ------------------------ |
| `Breadcrumb`     | `breadcrumb.tsx`      | Path navigation          |
| `NavigationMenu` | `navigation-menu.tsx` | Top-level nav menu       |
| `Menubar`        | `menubar.tsx`         | Application menu bar     |
| `Pagination`     | `pagination.tsx`      | Page navigation          |
| `Tabs`           | `tabs.tsx`            | Tabbed content           |
| `Command`        | `command.tsx`         | Command palette / search |

### Forms

| Component     | File               | Description                         |
| ------------- | ------------------ | ----------------------------------- |
| `Button`      | `button.tsx`       | Primary action button with variants |
| `ButtonGroup` | `button-group.tsx` | Grouped buttons                     |
| `Input`       | `input.tsx`        | Text input field                    |
| `Textarea`    | `textarea.tsx`     | Multi-line text input               |
| `Label`       | `label.tsx`        | Form label                          |
| `Select`      | `select.tsx`       | Dropdown select                     |
| `Checkbox`    | `checkbox.tsx`     | Checkbox input                      |
| `RadioGroup`  | `radio-group.tsx`  | Radio button group                  |
| `Switch`      | `switch.tsx`       | Toggle switch                       |
| `Slider`      | `slider.tsx`       | Range slider                        |
| `Calendar`    | `calendar.tsx`     | Date picker                         |
| `Form`        | `form.tsx`         | Form wrapper with validation        |
| `Field`       | `field.tsx`        | Form field component                |
| `Item`        | `item.tsx`         | Form item wrapper                   |
| `InputOTP`    | `input-otp.tsx`    | OTP code input                      |

### Feedback

| Component     | File               | Description                  |
| ------------- | ------------------ | ---------------------------- |
| `Alert`       | `alert.tsx`        | Status alert banner          |
| `AlertDialog` | `alert-dialog.tsx` | Confirmation dialog          |
| `Toast`       | `sonner.tsx`       | Toast notifications (Sonner) |
| `Progress`    | `progress.tsx`     | Progress bar                 |
| `Empty`       | `empty.tsx`        | Empty state placeholder      |
| `Spinner`     | `spinner.tsx`      | Loading spinner              |
| `Badge`       | `badge.tsx`        | Status badge                 |
| `Kbd`         | `kbd.tsx`          | Keyboard key display         |

### Data Display

| Component     | File               | Description            |
| ------------- | ------------------ | ---------------------- |
| `Table`       | `table.tsx`        | Data table             |
| `Accordion`   | `accordion.tsx`    | Collapsible sections   |
| `Collapsible` | `collapsible.tsx`  | Show/hide content      |
| `Chart`       | `chart.tsx`        | Recharts wrapper       |
| `Carousel`    | `carousel.tsx`     | Image/content carousel |
| `AspectRatio` | `aspect-ratio.tsx` | Aspect ratio container |

### Overlays

| Component      | File                | Description            |
| -------------- | ------------------- | ---------------------- |
| `Popover`      | `popover.tsx`       | Floating content panel |
| `Tooltip`      | `tooltip.tsx`       | Hover tooltip          |
| `HoverCard`    | `hover-card.tsx`    | Rich hover preview     |
| `ContextMenu`  | `context-menu.tsx`  | Right-click menu       |
| `DropdownMenu` | `dropdown-menu.tsx` | Dropdown menu          |

### Media

| Component | File         | Description                            |
| --------- | ------------ | -------------------------------------- |
| `Avatar`  | `avatar.tsx` | User avatar with fallback              |
| `Image`   | —            | Standard img with Next.js optimization |

### Toggle

| Component     | File               | Description          |
| ------------- | ------------------ | -------------------- |
| `Toggle`      | `toggle.tsx`       | Pressed state button |
| `ToggleGroup` | `toggle-group.tsx` | Group of toggles     |

---

## Custom Components

### Layout Components

#### `Layout.tsx` (`src/components/Layout.tsx`)

- Wraps all pages with Navbar + Footer
- Initializes Lenis smooth scroll
- Sets dark background (`#0B0E14`)

#### `Navbar.tsx` (`src/components/Navbar.tsx`)

- Sticky top navigation with blur backdrop
- Scroll-aware background opacity
- Desktop links + mobile hamburger drawer
- Auth-aware CTA buttons (Login/Sign Up or Account/Logout)
- Admin link for admin users
- Framer Motion mobile menu animations

#### `Footer.tsx` (`src/components/Footer.tsx`)

- 4-column grid: Product, Resources, Company, Legal
- Brand column with social links (GitHub, Twitter, LinkedIn)
- Bottom bar with copyright

#### `AuthLayout.tsx` (`src/components/AuthLayout.tsx`)

- Sidebar layout with resizable width
- Collapsible navigation menu
- User avatar dropdown with logout
- Mobile responsive header
- Auth guard (redirects to login if not authenticated)

#### `AdminLayout.tsx` (`src/components/AdminLayout.tsx`)

- Admin portal sidebar with 4 nav items
- Mobile sheet navigation
- Auth guard with admin role check
- Access denied page for non-admins

#### `AuthLayoutSkeleton.tsx` (`src/components/AuthLayoutSkeleton.tsx`)

- Loading skeleton for auth layouts
- Sidebar + main content placeholder blocks

---

### Animation Components

#### `NeuralCanvas.tsx` (`src/components/NeuralCanvas.tsx`)

- Canvas-based particle network animation
- 70 nodes with oscillating movement
- Mouse-repulsion interaction
- Connection lines with distance-based opacity
- Respects `prefers-reduced-motion`
- Used as hero section background

#### `AnimatedCounter.tsx` (`src/components/AnimatedCounter.tsx`)

- Counts up to target number with easing
- Triggers on scroll into view (Framer Motion `useInView`)
- Configurable duration, prefix, suffix
- Used in stats section

---

### Page-Specific Components

#### Research Page

| Component     | File                                      | Description                      |
| ------------- | ----------------------------------------- | -------------------------------- |
| `AgentCanvas` | `src/components/research/AgentCanvas.tsx` | Visual agent simulation canvas   |
| `ActivityLog` | `src/components/research/ActivityLog.tsx` | Real-time research activity feed |

#### Resume Page

| Component            | File                                           | Description                   |
| -------------------- | ---------------------------------------------- | ----------------------------- |
| `ResumeCard`         | `src/components/resume/ResumeCard.tsx`         | Grid card for tailored resume |
| `ResumeListRow`      | `src/components/resume/ResumeListRow.tsx`      | List row for tailored resume  |
| `ResumePreviewModal` | `src/components/resume/ResumePreviewModal.tsx` | Full-screen resume preview    |
| `HtmlResumeRenderer` | `src/components/resume/HtmlResumeRenderer.tsx` | HTML resume generation        |

---

### Utility Components

#### `PricingCard.tsx` (`src/components/PricingCard.tsx`)

- Plan selection card with features list
- Highlighted state for selected plan
- Hover lift animation
- Used in SignupPage

---

## Styling System

### CSS Variables (`src/index.css`)

```css
:root {
  --deep-navy: #0b0e14;
  --midnight: #111827;
  --electric-blue: #00c9ff;
  --ice-white: #f5f7fa;
  --indigo-deep: #1e3a8a;
  --purple-glow: #7c3aed;
  --soft-blue: #3b82f6;
  --slate-400: #94a3b8;
  --slate-500: #64748b;
  --slate-700: #334155;
  --slate-800: #1e293b;
}
```

### Tailwind Utilities

```css
.hero-gradient {
  /* Deep navy to indigo */
}
.accent-gradient {
  /* Electric blue to purple */
}
.card-glow {
  /* Radial glow at top */
}
.progress-gradient {
  /* Blue to purple */
}
.text-gradient {
  /* Gradient text clip */
}
.shimmer-bg {
  /* Animated loading shimmer */
}
```

### shadcn/ui Theme

The project uses a custom dark theme with shadcn/ui CSS variables. All components are styled with Tailwind classes using the project's color palette.

---

## Animation Patterns

### Framer Motion

Used throughout for:

- Page transitions
- Scroll-triggered reveals (`useInView`)
- Staggered list animations
- Hover effects
- Mobile menu slide-in
- Modal/drawer animations

Common easing: `[0.16, 1, 0.3, 1]` (ease-out-expo)

### GSAP

Available via `gsap` package. Used for:

- Complex timeline animations
- ScrollTrigger integrations

### Lenis

Smooth scroll wrapper in `Layout.tsx`:

```ts
const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
```

---

## Component Usage Patterns

### Card with Glow

```tsx
<div
  className="rounded-2xl border p-6"
  style={{
    backgroundColor: "var(--midnight)",
    borderColor: "var(--slate-700)",
  }}
>
  <div
    className="pointer-events-none absolute inset-0 rounded-2xl"
    style={{
      background:
        "radial-gradient(circle at 50% 0%, rgba(0, 201, 255, 0.08) 0%, transparent 60%)",
    }}
  />
  {/* Content */}
</div>
```

### Animated Section Reveal

```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-15% 0px" }}
  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
>
  {/* Content */}
</motion.div>
```

### Button with Glow

```tsx
<button
  className="accent-gradient text-white rounded-lg px-6 py-3"
  style={{ boxShadow: "0 0 20px rgba(0, 201, 255, 0.2)" }}
  onMouseEnter={e =>
    (e.currentTarget.style.boxShadow = "0 0 30px rgba(0, 201, 255, 0.35)")
  }
  onMouseLeave={e =>
    (e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 201, 255, 0.2)")
  }
>
  Action
</button>
```
