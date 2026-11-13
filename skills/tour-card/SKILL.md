---
name: tour-card
description: Build product-tour / onboarding cards in React that match the codebase's own design system — a step card with heading, close ×, image/GIF/video, subtext, "1 of 4" counter, Later + Next and an optional pointer triangle over a dimmed app. Reads the project's tokens (colours, radius, font family, type scale, weights, icon library) and styles the card from them, falling back to neutral defaults in a fresh project; then spins up a temporary dev-only playground route (sliders, toggles, colour pickers, pointer dial, double-click editing) so the user can fine-tune, applies the result, and deletes the playground. Use this whenever someone asks for a product tour, onboarding walkthrough, feature announcement / "what's new" modal, coach mark, guided step popover or spotlight tooltip with an arrow, even if they don't say "tour".
---

# Tour card

Your job is to give the user a tour card that already looks like *their* product, then let them
fine-tune it in a throwaway playground. Working source is in `assets/tour-card/`; copy and adapt it
rather than rewriting — most of its value is in details that took several rounds of feedback to get
right (see "Details that matter").

## Workflow

### 1. Read the codebase's design system

Before copying anything, collect the tokens the card needs. `references/design-tokens.md` lists where
to look per stack (Tailwind v4 `@theme`, `tailwind.config`, shadcn CSS variables, MUI/Chakra themes,
`next/font`, existing Button/Dialog components) and how each token maps onto a card setting.

Aim to fill, from real values in the repo:

| Card setting | Usually comes from |
|---|---|
| `cardColor`, `headingColor`, `textColor` | popover / card / surface tokens, or an existing dark dialog |
| `buttonColor`, `buttonTextColor` | primary / brand / accent tokens, or the default Button variant |
| `laterTextColor`, `laterFill`/`laterBgColor` | ghost or secondary Button variant |
| `cardRadius`, `mediaRadius`, `buttonRadius` | `--radius` scale, Card/Dialog/Button classes |
| `fontFamily` | the app's sans font variable (`var(--font-sans)` etc.) |
| `headingSize`, `textSize` | type scale, or sizes used in existing dialogs |
| `headingWeight`, `textWeight`, `buttonWeight` | weights used for titles / body / buttons |

Prefer CSS variables over copied hex values when the project themes with them (`"var(--primary)"`
keeps dark mode working). The playground's colour pickers need hex, so if a token is a variable, give
the playground its resolved hex as a starting value and keep the variable in the production config.

**Fresh project or no design system?** Don't invent a brand. Use the defaults in `TourCard.tsx`
(dark `#20272C` card, teal `#019D91` primary, 12/8/6 radii, 18/16px type) and tell the user that's
what they're seeing.

Write the result into `tour-card.config.ts` (`TOUR_CARD_STYLE`). Both the production card and the
playground read from it, so there is exactly one place the look lives.

### 2. Add the card

Copy into the project's component folder (e.g. `components/tour-card/`):
`TourCard.tsx`, `tour-card.config.ts`, and `cn.ts` (only if the project has no `cn`/`clsx` helper).

- **Packages:** install whatever is missing with the project's package manager (check the lockfile:
  pnpm / yarn / bun / npm): `motion` (or point imports at `framer-motion` if that's what's installed),
  `clsx` + `tailwind-merge` for `cn`, and the icon package.
- **Icons:** use the library the codebase already uses (lucide, phosphor, heroicons, tabler, an
  in-house set…). If it has none, use Hugeicons (`@hugeicons/react` + `@hugeicons/core-free-icons`).
  The production card needs **one** icon: the close ×. The image icon in `TourCard.tsx` only renders
  in the playground's edit-mode hint; the refresh and dashboard icons live in playground files.
- **Fonts:** don't load a new font; use the project's (`fontFamily` from step 1).
- Wire it into the app where the user asked: steps, open/close state, backdrop, and remembering that
  the tour was seen (localStorage or their user settings — ask if unclear).
- In Next.js repos whose `AGENTS.md` says the Next version differs from your training data, read the
  relevant guide in `node_modules/next/dist/docs/` before adding routes.

### 3. Open the temporary playground

Unless the user only wants the code, spin up the playground so they can tune the card visually:

1. Copy `TourPlayground.tsx`, `controls.tsx`, `color-picker.tsx`, `DashboardMock.tsx` next to the
   card and add a route from `page.tsx` (e.g. `app/tour-lab/page.tsx`). The route 404s in production
   builds, so a forgotten playground can't ship.
2. **Keep a list of every file and package you added for the playground** (separate from the card's).
   You need it to remove them cleanly later.
3. Don't commit playground files.
4. Start the dev server if it isn't running, open the route if you have a browser tool, and confirm it
   renders (type-check + lint at minimum).
5. Tell the user plainly, something like:

   > The playground is live at **http://localhost:3000/tour-lab** (dev only). It starts from your
   > design system's colours, radius and fonts. Tweak anything — double-click text to edit,
   > double-click the image to swap it — then hit **Copy settings (JSON)** and paste it here. I'll
   > apply it to the real card and remove the playground; it's temporary.

### 4. Apply and clean up

When the user pastes the JSON (or says they're happy):

- Merge its `style` into `TOUR_CARD_STYLE` (drop keys equal to the defaults to keep it short) and
  carry over any step copy they edited into wherever the steps live.
- Delete exactly the playground files on your list and the route folder, and uninstall packages you
  added *only* for the playground. Touch nothing else.
- Type-check, then tell the user what was applied and what was removed.

If the user wants to keep the playground, leave it (it's already production-safe) and say so.

## The card

Defaults, used when the codebase has no design system to read:

| Part | Default |
|---|---|
| Size | 500px wide, `max-w-full`; height follows content |
| Background | `#20272C`, radius 12; optional linear gradient (second colour + angle) |
| Heading | 18px, weight 700, white, × close on the opposite end |
| Media | 4:3, radius 8, autoplay + muted + loop + `playsInline`, no controls |
| Subtext | 16px, line-height 1.75, weight 400, `#ADB6BE` |
| Footer | counter ("1 of 4") left; Later (ghost) + primary right, flush with the content edge |
| Primary | `#019D91`, white text; last step reads something like "Done" |
| Buttons | `px-3 py-1`, weight 500, radius 6 |
| Spacing | sides 16, top/bottom 20, section gaps 16, subtext → footer 28 |
| Pointer | triangle on the card edge, size 14 |

**Padding model:** one `padding` value sets how far the media sits from the card edge (0 = full
bleed). Text and buttons follow it but never get closer than 16px. `footerGap` (subtext → footer) is
separate because users tune it independently.

**Matching a screenshot instead of a design system:** match *its* proportions (width, type sizes,
media ratio, radii) rather than forcing the 500px default, and keep every dismiss path it shows.

### Behaviour

- Next advances; the last step's primary closes. Later, ×, and Esc close; ← / → move between steps.
- Media and copy cross-fade between steps; the card springs in and out.
- Backdrop: tint at ~55% with `grayscale(0.7)` via `backdrop-filter`; app behind at 90% opacity.
- Toggles users want: media, heading, heading position, counter, close ×, pointer.

### Accessibility

The card is a labelled dialog (`role="dialog"`, `aria-labelledby` / `aria-label`, `aria-describedby`),
the counter is `aria-live`, and movement drops under `prefers-reduced-motion`. In the app wrapper,
focus the primary button when the tour opens and return focus to the trigger on close. For GIFs
through `next/image`, set `unoptimized` or Next serves a frozen first frame.

## The playground

Left panel: step, visibility toggles, heading position, pointer (dial + size), scale, padding,
text-to-buttons gap, radii, typography (sizes + weights). Right panel: preset (**Your brand** = the
config, **Default** = skill defaults), colours incl. gradient, buttons, backdrop, restart, and **Copy
settings (JSON)**. Compact Figma-like density (11px text, 28px rows) so it fits a ~700px window
without scrolling. The stage stays at the card's 100% width; scale only zooms the card.

## Details that matter

These all came from real bug reports; keep them when adapting the code.

- **Pointer seam:** a triangle ending exactly at the card edge shows a hairline when zoomed. Run its
  base a few px under the card (`clip-path: polygon(50% 0, 100% 50%, 100% 70%, 0 70%, 0 50%)`), render
  it before the card, and keep it outside the card's `overflow-hidden` box. Place it by casting a ray
  from the card centre at the chosen angle; clamp it clear of rounded corners.
- **Gradient + pointer:** fill the pointer with the gradient's colour *at its position*
  (`gradientColorAt` in `TourCard.tsx`), or it shows as a flat patch.
- **Editable text:** `contentEditable` span keyed by its value (remount on commit); Enter/blur
  commits, Esc restores; stop key propagation so tour shortcuts don't fire while typing.
- **Editable buttons:** use `div role="button"`; in edit mode delay the click ~230ms and cancel it
  when `e.detail > 1`, or a double-click both edits the label and advances the tour.
- **Picked media:** object URLs have no extension — tag videos (`${url}#.mp4`); revoke on unmount.
- **State added later arrives undefined** across hot reloads; merge state over defaults at render.
- **Collapsible sections in a fixed-height panel get squashed;** give panel children `shrink-0`.
- Separate text colours for primary and Later; let padding reach 0; no truncated control labels.
