# tour-card skill

An agent skill for building **product-tour / onboarding cards** in React + Tailwind that look like
*your* product. The agent reads your design system (colours, radius, font, type scale, weights, icon
library), styles the step card from it — heading, close ×, autoplaying image/GIF/video, subtext,
“1 of 4” counter, Later / Next, an edge pointer over a dimmed app — and falls back to clean defaults in
a fresh project.

Then it opens a **temporary, dev-only playground** route so you can fine-tune everything visually
(colours and gradient, padding, radii, typography, toggles, a rotary dial for the pointer,
double-click inline editing, media swapping). Hit *Copy settings*, paste it back to the agent, and it
applies the result to the real card and deletes the playground.

## Install

```bash
npx skills add bikash1376/tour-card-skill
```

Then ask your agent for things like “add a 3-step onboarding tour” or “add a what's-new popup for
the new editor”.

## What's inside

- `skills/tour-card/SKILL.md` — the workflow (read tokens → card → playground → apply & clean up),
  defaults, behaviour, accessibility, and the bugs worth avoiding
- `skills/tour-card/references/design-tokens.md` — where to find tokens per stack and how they map
- `skills/tour-card/assets/tour-card/` — working source: `TourCard` + `tour-card.config.ts`, and the
  playground (`TourPlayground`, controls, colour picker, mock dashboard, dev-only route)
- `skills/tour-card/evals/` — test prompts and pass/fail checks used to develop the skill

Needs React + Tailwind CSS v4. The agent installs what's missing (`motion`, `clsx` + `tailwind-merge`)
and uses your icon library for the card's single close icon, defaulting to Hugeicons.
