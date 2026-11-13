---
tags: [skill-creator]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

I'm adding a 3-step onboarding tour to our Next.js dashboard (app router, Tailwind v4, lucide-react for icons, framer-motion is installed, we already have a cn() helper in lib/utils.ts). Build the tour card component and a small demo page that shows it over a dimmed dashboard. Steps: 'Your projects' (projects.gif), 'Invite your team' (invite.mp4), 'Billing & plans' (billing.png) — media lives in /public/onboarding/. Dark card, teal Next button, a Later button, step counter like '1 of 3'. There's no repo here, so just write the files.
