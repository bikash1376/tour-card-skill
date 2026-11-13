// TEMPORARY playground route, e.g. app/tour-lab/page.tsx. Remove it (and TourPlayground.tsx,
// controls.tsx, color-picker.tsx, DashboardMock.tsx) once the user is happy with the card.
import { notFound } from "next/navigation";

import TourPlayground from "@/components/tour-card/TourPlayground";

export default function TourLabPage() {
  // Never ship the playground: production builds 404 even if cleanup was forgotten.
  if (process.env.NODE_ENV === "production") notFound();
  return <TourPlayground />;
}
