import { NextResponse, type NextRequest } from "next/server";
import { TOOLS } from "@/lib/registry";
import { GOALS } from "@/lib/goals";

/**
 * Real 404s for unknown dynamic slugs.
 * With cacheComponents, an unknown /tools/<x> or /pace/<x> would stream the not-found UI with HTTP 200
 * (a "soft 404" that Google dislikes). Rewriting to a path no route matches makes Next.js render
 * not-found.tsx with a proper 404 status.
 */
const TOOL_SLUGS = new Set(TOOLS.map((t) => t.slug));
const GOAL_SLUGS = new Set(GOALS.map((g) => g.slug));

export function proxy(request: NextRequest) {
  const [, section, slug, ...rest] = request.nextUrl.pathname.split("/");
  const known =
    (section === "tools" && TOOL_SLUGS.has(slug) && (rest.length === 0 || rest[0] === "opengraph-image")) ||
    (section === "pace" && GOAL_SLUGS.has(slug) && rest.length === 0);
  if (known) return NextResponse.next();
  return NextResponse.rewrite(new URL("/__not-found", request.url));
}

export const config = {
  matcher: ["/tools/:path+", "/pace/:path+"],
};
