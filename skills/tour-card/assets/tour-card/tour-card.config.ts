import type { CardStyle } from "./TourCard";

/**
 * The tour card's look for THIS codebase. Fill it from the project's design system (colours,
 * radius, font, type scale, weights); anything left out falls back to the skill's defaults.
 * Both the production card and the temporary playground read from here, so applying the
 * playground's "Copy settings" output means pasting its `style` into this object.
 */
export const TOUR_CARD_STYLE: Partial<CardStyle> = {
  // cardColor: "#0F172A",
  // buttonColor: "var(--primary)",
  // cardRadius: 12,
  // fontFamily: "var(--font-sans)",
};
