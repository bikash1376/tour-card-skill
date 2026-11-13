# tour-card skill

An agent skill for building **product-tour / onboarding cards** in React + Tailwind: the step card with
heading, close ×, autoplaying image/GIF/video, subtext, “1 of 4” counter, Later / Next and an edge
pointer over a dimmed app — plus an optional **live playground** to design it (compact Figma-style
panels: colours and gradient, padding, radii, font weights, toggles, a rotary dial for the pointer,
presets, double-click inline editing, media picking, JSON export).

## Install

```bash
npx skills add bikash1376/tour-card-skill
```

Then ask your agent for things like “add a 3-step onboarding tour”, “make a what's-new popup like
Figma's”, or “give me a playground to tweak our tour card”.

## What's inside

- `skills/tour-card/SKILL.md` — design defaults, behaviour, accessibility, and the bugs worth avoiding
- `skills/tour-card/assets/tour-card/` — working source: `TourCard`, `TourPlayground`, controls,
  colour picker, mock dashboard
- `skills/tour-card/evals/` — test prompts and pass/fail checks used to develop the skill

Requires React, Tailwind CSS v4, `motion`, `clsx` + `tailwind-merge`; icons default to Hugeicons and
are easy to swap.
