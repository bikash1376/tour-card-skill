---
name: tour-card
description: Build product-tour / onboarding cards in React — the dark "Workspace switcher"-style step card with a heading, close ×, image/GIF/video, subtext, "1 of 4" step counter, Later + Next buttons and an optional pointer triangle, shown over a dimmed app backdrop — plus an optional live playground route to tweak it (Figma-sized side panels with sliders, segmented controls, switches, colour pickers, a rotary dial for the pointer, double-click-to-edit text and media). Use this whenever someone asks for a product tour, onboarding walkthrough, feature announcement / "what's new" modal, coach mark, guided step popover, spotlight tooltip with an arrow, or a Figma-like "Try it out / Got it" card, even if they don't say "tour" — and whenever they want a playground, customiser or knobs to design such a card.
---

# Tour card

A step card for product tours and feature announcements, and a playground to design it live.
Working source for both lives in `assets/tour-card/`; copy it rather than rewriting from scratch,
because most of its value is in small details that took several rounds of user feedback to get right
(listed under "Details that matter" so you can keep them when adapting).

## What to build

Decide which of these the request needs:

1. **Just the card** (most requests: "add an onboarding tour", "feature announcement modal").
   Copy `TourCard.tsx` + `cn.ts`. Wire steps, open/close state and a backdrop in the user's page.
2. **Card + playground route** ("let me tweak it", "make a playground", "customiser", "/tuts page").
   Copy the whole `assets/tour-card/` folder and add a route (see `page.tsx`).

## Setup

1. Look at the project first: framework (Next app router? Vite?), Tailwind version, whether `cn`
   already exists, which icon library and animation library are installed. In Next.js projects with
   an `AGENTS.md` that says the Next version differs from your training data, read the relevant doc
   in `node_modules/next/dist/docs/` before writing routes.
2. Copy files into the project's component folder (e.g. `components/tour-card/`). Fix imports:
   - `cn`: reuse the project's helper if there is one, otherwise keep `cn.ts` (needs `clsx` + `tailwind-merge`).
   - Icons: the templates use `@hugeicons/react` + `@hugeicons/core-free-icons`. If the project uses
     another set (lucide, phosphor…), swap the handful of icons (close ×, image, refresh, dashboard nav icons).
   - Animation: `motion/react` (Motion v11+). If the project only has `framer-motion`, change the import path.
3. Media: put the user's image/GIF/video in `public/` and point `media` at it. `placeholder.svg` is a
   neutral stand-in — copy it to `public/tour-card/placeholder.svg` only if nothing better exists.
4. Fonts: the card uses the project's sans font (`font-sans`, Geist in the original); panels use
   `var(--font-inter)` with a fallback — adjust to what the project loads.
5. Install only what's missing, then type-check and lint. If a browser tool is available, open the
   route and actually look at it; layout bugs here are visual (seams, squashed panels).

## The card (defaults the user signed off on)

| Part | Default |
|---|---|
| Size | 500px wide, `max-w-full`; height follows content |
| Background | `#20272C`, radius 12; optional linear gradient (second colour + angle, off by default) |
| Heading | 18px, weight 700, white, × close on the opposite end |
| Media | 4:3 (468×350 at full size), radius 8, autoplay + muted + loop + `playsInline`, **no controls** |
| Subtext | 16px, line-height 1.75, weight 400, `#ADB6BE` |
| Footer | counter ("1 of 4") left in subtext colour; buttons right, flush with the card's content edge |
| Later | ghost button, white text, hover = `color-mix(in srgb, <card>, white 9%)`; optional fill colour |
| Primary | `#019D91`, white text; label "Next", last step something like "Done"/"New section" |
| Buttons | `px-3 py-1`, weight 500, radius 6 |
| Spacing | sides 16, top/bottom 20, section gaps 16, subtext → footer 28 |
| Pointer | triangle on the card edge, size 14, default pointing left (270°) |

**Matching a reference screenshot:** the table above is the house default, not a size to force onto
a reference. When the user shows another product's card, match *its* proportions: width (Figma's
announcement card is ~320px with 13px text, not 500px with 18px), type sizes, media aspect ratio and
radius. Keep every dismiss path the reference has (a close × especially), even if the request text
didn't mention it.

`FIGMA_CARD_STYLE` in `TourCard.tsx` shows the same component reproducing Figma's announcement modal
(full-bleed media, grey filled "Got it", blue "Try it out", no counter, pointer bottom-right). Use it
as proof that a reference screenshot can usually be matched with style values alone — try that before
adding new props.

### Padding model

One "padding" value controls how far the **media** sits from the card edge (0 = full bleed). Text and
buttons follow it but never get closer than 16px; at 0 padding, text hugging the edge looks broken.
Top/bottom are padding + 4. The subtext → footer gap is its own setting (`footerGap`) because users
tune it independently.

### Accessibility (keep it in production)

The template card is a labelled dialog (`role="dialog"`, `aria-labelledby` heading or `aria-label`
when the heading is hidden, `aria-describedby` subtext), announces the counter with `aria-live`, and
drops movement for `prefers-reduced-motion`. In the wrapper you write for the user's app, also move
focus to the primary button when the tour opens (not in the editable playground — it steals the
caret), and return focus to whatever opened it on close. Close × needs an `aria-label`.

For GIFs through `next/image`, set `unoptimized` or Next serves a frozen first frame.

### Behaviour

- Steps: Next advances, last step's primary closes; Later, ×, and Esc close; ← / → move between steps.
- Media and copy cross-fade on step change; the card springs in/out; show a "Replay tour" when closed.
- Backdrop over the app: tint `#2B3136` at 55%, `grayscale(0.7)` via `backdrop-filter`, optional blur.
  The app behind sits at 90% opacity while the tour is open, 80% once dismissed.
- Toggles a user will want: media, heading, heading position (top vs. just above the subtext — only
  meaningful when media is on), counter, close ×, pointer.
- Close × with the heading moved below the media floats over the media's corner on a translucent chip.

## The playground

Layout: left panel (content & layout), centre stage (mock app + backdrop + card), right panel (style).
Match Figma's inspector density: 11px text, 28px rows, small bold section titles, hairline dividers,
~256px panels — everything should be visible without scrolling on a ~700px-tall window. Controls come
from `controls.tsx` (`Segmented`, `Slider` with fill-track, `Switch`, `ColorField`, `Dial`, `Row`),
wrapped in `<ControlsDensity value="compact">`.

- **Stage width is fixed** at the card's 100% width + ~70px each side and the mock dashboard is drawn
  at full size behind it, cropped. Changing card scale must resize only the card (CSS `zoom`), never
  the stage, or the side panels jump.
- **Responsive:** below `lg` the stage goes first and the card zoom is `min(scale, (stageWidth − gutters) / 500)`;
  panels sit side by side on tablet, stacked on phones.
- **Inline editing:** double-click heading, subtext, counter, and both button labels to edit them;
  double-click the media to open a file picker (images, GIFs, videos). Per-step content.
- **Pointer placement** uses a rotary dial (drag around it like a fan regulator, arrow keys nudge);
  show the angle and a compass word ("Bottom right · 120°").
- **Copy settings (JSON)** button: the designer tweaks, the developer pastes. Export style plus
  per-step copy, and replace local `blob:` media with a placeholder string.
- Presets segmented control (Default / Figma) that shows no selection once the user customises.

## Details that matter

These all came from real bug reports; keep them when adapting the code.

- **Pointer seam:** a triangle that ends exactly at the card edge shows a hairline at fractional zoom.
  Extend its base a few px *under* the card (clip-path `polygon(50% 0, 100% 50%, 100% 70%, 0 70%, 0 50%)`)
  and render it before the card so the card covers the overlap. Place it by casting a ray from the card
  centre at the dial angle, then clamp along the edge by `radius + size` so it never sits on a corner.
  The card itself has `overflow-hidden`, so the pointer must live in an outer wrapper.
- **Editable text:** use `contentEditable` on a span keyed by its value (remount on commit — otherwise
  React reconciles against browser-mutated text nodes). Enter/blur commits, Esc restores, stop key
  propagation so the tour's arrow/Esc shortcuts don't fire while typing.
- **Editable buttons:** a `<button>` can't host editable text reliably, so use `div role="button"`
  with Enter/Space handling. In edit mode, delay the click action ~230ms and cancel it when
  `e.detail > 1`, or a double-click both edits the label and triggers Next/Later.
- **Picked files:** object URLs have no extension, so tag videos (`${url}#.mp4`) for the
  image-vs-video check; revoke URLs on unmount.
- **Gradient backgrounds and the pointer:** a pointer filled with the flat card colour shows a
  visible patch on a gradient card. Fill it with the gradient's colour *at the pointer's position*
  (`gradientColorAt` in `TourCard.tsx` mirrors the CSS spec: project the point onto the gradient line,
  whose length is `|w·sin a| + |h·cos a|`, then `color-mix` the two stops).
- **Production card vs. playground card:** the editing code (`EditableText`, delayed `ActionButton`)
  is inert unless `editable` is set, so one component serves both. If the user only wants a
  production card, it's fine to strip editing out — but keep the pointer, padding model and a11y.
- **Separate colours** for primary text and Later text — one shared "button text" colour annoys users.
- **Settings added later arrive undefined** across hot reloads (React warns "uncontrolled to controlled").
  Merge state over defaults at render: `const card = { ...DEFAULTS, ...state }`.
- **Collapsing sections in a fixed-height flex panel get squashed** (overflow-hidden children shrink to
  their title). Give panel children `shrink-0` so short windows scroll instead.
- **Slider min values:** let padding reach 0; users test the extremes.
- Don't let truncated labels through ("Gr…"): shorten labels or drop to 2 columns.
