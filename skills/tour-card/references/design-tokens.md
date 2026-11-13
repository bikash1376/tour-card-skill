# Reading a codebase's design system

Where to find each token the tour card needs, by stack. Search, don't guess: open the files and
use the values you find. If two sources disagree, prefer what existing components actually render
(a Button's classes beat an unused token).

## Contents
- Where to look (by stack)
- Mapping to `CardStyle`
- Dark surfaces, light themes and contrast
- Icons
- Reporting what you found

## Where to look

**Tailwind v4** — `app/globals.css` (or the main CSS entry) `@theme { ... }` block: `--color-*`,
`--radius-*`, `--font-*`, `--text-*`, `--font-weight-*`. Also `:root` / `.dark` variable blocks.

**Tailwind v3** — `tailwind.config.{js,ts}` → `theme.extend.colors`, `borderRadius`, `fontFamily`,
`fontSize`, `fontWeight`; `@layer base` in the CSS entry.

**shadcn/ui** — `components.json` (style, base colour, CSS-variable mode) and the CSS variables it
writes: `--background`, `--foreground`, `--popover`, `--popover-foreground`, `--primary`,
`--primary-foreground`, `--secondary`, `--muted-foreground`, `--radius`. Radii: `--radius` is the
large radius; buttons typically use `calc(var(--radius) - 2px)`. Check `components/ui/button.tsx` and
`dialog.tsx`/`popover.tsx` for the real classes.

**CSS-in-JS / component kits** — MUI `createTheme` (`palette`, `shape.borderRadius`, `typography`),
Chakra `extendTheme`, Mantine `createTheme`, styled-components theme objects, Radix Themes
`<Theme accentColor radius>`, Panda/Stitches token files.

**Fonts** — `next/font` calls in `app/layout.tsx` (the `variable` name, e.g. `--font-geist-sans`),
`@font-face` / Google Fonts links, `font-sans` mapping in the Tailwind theme. Use the variable, not
the family string, so the card follows the app if fonts change.

**Existing UI as evidence** — the primary Button, any Dialog/Popover/Tooltip/Toast, and onboarding or
empty-state components show the sizes, weights and radii the team actually uses.

## Mapping to `CardStyle`

| `CardStyle` key | Take it from |
|---|---|
| `cardColor` | popover / card surface; for a dark tour card on a light app, the foreground or an existing dark tooltip colour |
| `headingColor` | popover-foreground / foreground on that surface |
| `textColor` | muted-foreground on that surface (check contrast, see below) |
| `buttonColor` / `buttonTextColor` | primary / primary-foreground (or brand / accent) |
| `laterTextColor` | the ghost/secondary button's text on the card surface |
| `laterFill` / `laterBgColor` | on if their secondary button is filled; use its background |
| `cardRadius` | dialog / popover radius (shadcn: `var(--radius)`) |
| `mediaRadius` | roughly `cardRadius - padding/2`, or their image/card-media radius |
| `buttonRadius` | the Button's radius class |
| `fontFamily` | the sans font variable |
| `headingSize` / `headingWeight` | their dialog title (often 16–18px, 600) |
| `textSize` / `textWeight` | body text (14–16px, 400) |
| `buttonWeight` | the Button's weight (usually 500) |

Leave everything else (padding, gaps, pointer, toggles) at the defaults unless the codebase clearly
says otherwise; those are what the playground is for.

## Dark surfaces, light themes and contrast

Tour cards usually read best as a contrasting surface (dark card on a light app, or an elevated
surface on a dark app). If the app has only light surfaces, it's fine to keep the default dark card
and just bring in the brand's primary, radius and font — say that you did. Keep body text at
roughly 4.5:1 contrast against the card; muted-foreground tokens tuned for white backgrounds often
fail on a dark card, so lighten them for the card.

CSS variables (`var(--primary)`) work in the production card and keep theming intact. The
playground's colour pickers need hex, so seed the playground with the resolved hex and keep the
variable in `tour-card.config.ts`.

## Icons

Check `package.json` for `lucide-react`, `@phosphor-icons/react`, `@heroicons/react`,
`@tabler/icons-react`, `react-icons`, `@radix-ui/react-icons`, or an in-house icon folder. Use that
library's close/X icon in `TourCard.tsx`. No library → `@hugeicons/react` + `@hugeicons/core-free-icons`
(`Cancel01Icon`). The playground's extra icons (image hint, refresh, dashboard mock) can stay
Hugeicons, since those files are deleted afterwards — but then uninstall Hugeicons during cleanup
if the card itself doesn't use it.

## Reporting what you found

Before showing the playground, give the user a short list of what you matched, so they can correct
it, for example:

> Matched your design system: card `--popover` (#0B0F19), primary `--primary` (#6D5BFF), radius
> `--radius` 10px (buttons 8px), font Inter via `--font-inter`, title 600 / body 400. Icons: lucide.
