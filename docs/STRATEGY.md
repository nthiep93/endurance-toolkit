# Endurance Toolkit — Go-to-Market & SEO Strategy

_Last reviewed: 2026-11-25. Owner: solo developer (Vietnam), English-language site, free, no login._

## 1. Positioning

**One sentence:** the fastest, cleanest running calculators on the web, each with an expert guide that shows the maths, with no sign-up wall and no pop-ups.

**Why we can win:** the incumbents are big content sites with calculators bolted onto long articles ([Marathon Handbook](https://marathonhandbook.com/calculators/), [the5krunner](https://the5krunner.com/tools/running-calculators/), [Calculator Academy](https://calculator.academy/running-pace-calculators/)), old-school utilities ([Fetcheveryone](https://fetcheveryone.com/training-calculators-units.php)), and a growing wave of single-purpose tool sites ([RunBundle](https://runbundle.com), [runcalcs](https://runcalcs.pages.dev/calculators/)). Our edge has to be **speed (Core Web Vitals), tool UX on mobile, accurate and openly documented formulas, and worked examples with real numbers**. Content volume will not be our edge; we would lose that race.

**What AI answers cite:** pages that state the answer in the first sentence, show the formula and give a verifiable table. Every guide follows that pattern (FAQ answers lead with the answer; tables are computed from the same formulas as the tools — see `docs/CALC_API.md`).

## 2. Keyword map (current 8 tools)

Search volumes and difficulty are **not** in this doc on purpose. **All volumes: to verify in Keyword Planner/Ahrefs** before we prioritise further work. Intent is based on what the current SERP looks like.

| Tool (slug) | Primary | Secondary | Intent | Notes |
|---|---|---|---|---|
| pace-calculator | running pace calculator | pace calculator, marathon pace calculator, min per km calculator | Tool (transactional-ish) | Most competitive head term. Win long-tail first ("what pace for 4 hour marathon"). |
| pace-converter | pace converter | treadmill pace converter, mph to min per mile, km/h to min/km | Tool + quick answer | Conversion tables are likely to show up as featured snippets and AI citations. |
| race-time-predictor | race time predictor | marathon time predictor, half marathon time predictor, riegel formula calculator | Tool | The "Riegel vs VDOT side by side" view is a differentiator. |
| vdot-calculator | vdot calculator | training pace calculator, jack daniels running calculator, threshold pace calculator | Tool | Avoid implying affiliation with Daniels/VDOT O2 — use descriptive wording only. |
| heart-rate-zones | heart rate zone calculator | running heart rate zones, karvonen formula calculator, zone 2 heart rate calculator | Tool + informational | "Zone 2" is a trend term; consider a dedicated zone-2 page later. YMYL-adjacent: keep the safety note. |
| marathon-splits | marathon split calculator | negative split calculator, pace band generator, half marathon splits | Tool | A printable pace band is a strong link-earner. |
| race-fueling-calculator | marathon fueling calculator | how many gels for a marathon, carbs per hour running, race nutrition calculator | Informational → tool | Best affiliate fit (gels, drink mix, belts). YMYL-adjacent. |
| cadence-stride-calculator | stride length calculator | running cadence calculator, steps per minute running, cadence pace calculator | Informational | Lower volume expected; good internal-link hub to form/shoes content. |

**On-page rules:** primary keyword in title, H1 and intro; one tool per URL; `HowTo` + `FAQPage` JSON-LD; visible "last updated" date; internal links via `related` in the registry; no doorway variants of the same tool.

## 3. Backlog: next tools ranked by demand × ease

Demand and ease are **qualitative** (H/M/L) based on SERP inspection, not measured volume. Re-score after Keyword Planner/Ahrefs.

| # | Tool / page set | Demand | Ease | Why / evidence |
|---|---|---|---|---|
| 1 | **Goal-pace pages** ("sub-4 marathon pace", "sub-2 half marathon pace", ~12–20 goal times) | H | H | Big sites rank dedicated pages for these, e.g. [Marathon Handbook 4-hour pace](https://marathonhandbook.com/4-hour-marathon-pace/), [marathon pace chart (km)](https://marathonhandbook.com/marathon-pace-chart-km/), [Brooks pace chart](https://www.brooksrunning.com/en_gb/blog/advice-tips/marathon-pace-chart.html), [the5krunner chart](https://the5krunner.com/tools/running-calculators/marathon-pace-chart/). See the programmatic caveat below. |
| 2 | Age grading calculator (WMA standards) | M–H | M | Established competitors ([Marathon Handbook](https://marathonhandbook.com/age-grade-calculator/), [RunBundle](https://runbundle.com/tools/age-grading-calculator), [USATF Masters](https://usatfmasters.org/age-grading/)). Factor tables are public ([Age-Grade-Tables on GitHub](https://www.github.com/AlanLyttonJones/Age-Grade-Tables)) — **check licence before use**. |
| 3 | Marathon/half pace chart page (single big table, printable) | H | H | Reuses calc lib; strong snippet candidate. |
| 4 | Running calories burned calculator | H (to verify) | H | Simple formula; high general-fitness demand; YMYL-light. |
| 5 | VO2max estimator (from race / Cooper test / HR ratio) | M | H | Reuses VDOT code; ties into watch-owner curiosity. |
| 6 | Treadmill incline / grade-adjusted pace | M | M | Natural extension of pace converter. |
| 7 | Training plan generator (5K → marathon, printable) | H | L | Highest value, hardest to do well; build after traffic baseline. |
| 8 | Heat/humidity pace adjustment | M | M | Strong angle for SEA/tropical runners; needs a defensible model and clear caveats. |
| 9 | Zone 2 calculator (dedicated page) | M–H | H | Reuses HR code; separate intent from full zones. |
| 10 | Track lap / interval time calculator | M | H | Lap times per pace, lane adjustments. |
| 11 | Boston / major marathon qualifying time checker | M | M | Standards change yearly → maintenance burden; seasonal demand. |
| 12 | Sweat rate calculator | L–M | H | Complements fueling; affiliate fit (electrolytes). |
| 13 | Carb-loading calculator | M | H | g/kg × days; pairs with fueling. |
| 14 | Running power / speed ↔ watts estimator | L | M | Niche, enthusiast audience. |
| 15 | Shoe mileage tracker (local storage, no login) | L–M | M | Retention + shoe affiliate fit. |
| 16 | Ultra / trail pace with elevation | M | L | Needs elevation model; competitive with apps. |
| 17 | BMI/weight-for-runners style tools | — | — | **Skip:** YMYL, crowded, off-brand. |
| 18 | **Race calendar Vietnam/SEA** (second property) | M (to verify) | L | Real events and big fields (e.g. [Halong Bay Heritage Marathon expecting 18,000 runners](https://vietnamnet.vn/en/halong-bay-heritage-marathon-2026-expected-to-attract-18-000-runners-2541784.html), [Da Nang International Marathon ~9,000](https://vietnamnet.vn/en/da-nang-international-marathon-2026-draws-nearly-9-000-runners-2499241.html), [VnExpress Midnight 13,000+](https://en.qdnd.vn/culture-sports/sports/vnexpress-midnight-marathon-draws-over-13-000-runners-589041)). But [Ahotu](https://www.ahotu.com/calendar/running/vietnam) and [AIMS](https://aims-worldrunning.org/countries/123.html) already list races; we'd need a local edge (Vietnamese + English, course/heat notes, split and fueling plans per race). Build as a separate property only after the toolkit has traffic. |

**Programmatic-page caveat:** Google's spam policies target "scaled content abuse": many pages generated mainly to manipulate rankings, whatever the method used to make them ([Google Search Central, March 2024](https://developers.google.com/search/blog/2024/03/core-update-spam-policies)). Google has also said that programmatic sites can lose trust, and that getting it back takes a long time ([TechWyse summary of John Mueller](https://www.techwyse.com/news/search-seo/google-john-mueller-programmatic-seo-site-trust-recovery)). Rules for goal-pace pages:
- Launch with at most about 12 pages, only at goal times people actually search (sub-3, 3:30, sub-4, 4:30, sub-5 for the marathon; sub-1:30, 1:45 and sub-2 for the half).
- Every page has to carry its own content: a checkpoint table, a negative-split variant, the training paces that time implies, a fueling estimate and how it compares with a predicted 10K or half time.
- Add more only if Search Console shows impressions growing on the first batch. Pages that get no impressions after 3 months are noindexed.

## 4. Monetization plan

**Phase 0 (weeks 0–8): no ads.** Fast pages help us earn links and get indexed, and AdSense commonly rejects thin or new sites as "low value content" ([AdSense community guide](https://support.google.com/adsense/community-guide/241032356/how-can-you-solve-the-low-value-content-adsense-disapproval-challenge?hl=en)).

**Phase 1: AdSense, once the content baseline is in place.** Apply when we have at least 12 tool pages with guides, About/Contact/Privacy/Terms pages and steady organic traffic. Ad rules:
- At most one ad above the fold.
- No ads inside the tool's input or result area, so CLS stays at 0.
- Lazy-load ads below the guide.
- Consider a premium ad network once traffic qualifies (thresholds: to verify).

**Sponsor slot.** One labelled "Supported by" slot per category page (for example a gel brand on the fueling tool, or a local race on the splits tool). Sell it directly at a flat monthly price once a page passes about 5k sessions a month (threshold to validate). Every sponsored link gets `rel="sponsored"`.

**Affiliates.** Each placement goes in a "gear that helps with this" box under the result, never inside it. Kinds of program:
- Running shoe and apparel retailers
- GPS watches and heart rate straps
- Gels, drink mix and electrolytes
- Treadmills
- Race registration platforms

Programs verified to exist (Nov 2026):
- **Amazon Associates.** Standard rates: Sports & Outdoors 3%, Shoes 4%, Apparel 4% ([rate table](https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ/)). It's easy to join, but the rates are low.
- **Brooks Running.** Runs through Impact with a 30-day referral window; the commission isn't published ([Brooks affiliate page](https://www.brooksrunning.com/en_us/affiliate-program)).
- **Running Warehouse.** Has a 90-day window, but new applications are **currently paused** ([programs page](https://www.runningwarehouse.com/programs)). Re-check monthly.
- **Runners Need (UK).** Listed on Webgains ([directory](https://www.webgains.com/public/en/directory/runners-need-affiliate-programme/)).
- **Garmin.** Appears in third-party affiliate directories, but we have **not verified an official program page**. Verify before planning around it.

Disclose affiliate links on every page that uses them. Also note that most of our traffic will likely be outside Vietnam, while local VN e-commerce programs only cover VN buyers. Geo-route links later if it's worth the effort.

## 5. Distribution: first 90 days

Honest caveat: these channels bring short spikes of traffic. SEO for a new domain usually takes months to compound. The main things distribution buys us are **feedback, a few natural links and branded searches**, not volume.

| Channel | Approach | Rules / risk |
|---|---|---|
| r/running | Be a genuine participant: answer pace and fueling questions with the numbers worked out in the comment. Share the site itself only in the **Social Saturday** thread. | Rule 3 bans self-promotion outside that thread, and accounts named after a product get banned. In their words: "a Redditor with a website", not "a website with a Reddit account" ([r/running FAQ/rules](https://www.reddit.com/r/running/wiki/faq)). |
| r/AdvancedRunning | Write discussion posts, e.g. "I compared Riegel vs VDOT predictions against 200 of my club's results". Link posts have to be text posts with a full summary. | Rule 7 bans advertising a personal site or app. Ask the mods before posting a project ([wiki](https://www.reddit.com/r/AdvancedRunning/wiki/index)). |
| Strava clubs | Run an "Endurance Toolkit" club and post weekly pace/fuel tips. Join local Vietnamese and SEA clubs as a member, not as a promoter. | Club posts reach only members, so growth is slow. Don't spam other clubs. |
| Facebook running groups (VN and international) | Offer free pace bands for a specific upcoming race, e.g. a split plan for the Hanoi or HCMC marathon. | Group admins often ban links. Ask first, and offer value with no link where you can. |
| Product Hunt | Launch once there are at least 12 tools and a polished mobile UX, on a weekday. Prepare the gallery, the maker comment and the first responses. | Running is a niche audience on PH. Expect one day of traffic and a handful of links. |
| Build in public (X, LinkedIn, Threads, dev.to) | Post the developer story: Next.js performance numbers, formula verification, weekly traffic. Tie it to the owner's marathon build. | The developer audience is not the runner audience. This channel is for links and credibility. |
| Outreach | Contact running coaches and clubs to offer embeddable calculators (iframe with attribution), and contact race organisers to offer a branded pace band for their race. | Embeds are the most scalable way to earn links. Keep the attribution link optional so it doesn't look like a link scheme. |

## 6. KPIs

Measure with Google Search Console and privacy-friendly analytics.
- **Leading:** indexed pages; Search Console impressions and average position for the 8 primary keywords; Core Web Vitals pass rate; tool completion rate (results shown ÷ sessions).
- **Lagging:** organic clicks; referring domains; branded searches; return visitor rate.
- **AI visibility:** each month, ask 20 fixed questions to the major AI assistants and AI search features (e.g. "how many gels for a marathon") and log any citations.
- **Revenue (Phase 1 onward):** RPM, affiliate EPC, sponsor fill.

## 7. 12-week milestone table

Targets are directional for a new domain; do not treat them as forecasts.

| Week | Milestone | Success check |
|---|---|---|
| 1 | 8 tools and guides live; sitemap, JSON-LD, Search Console and analytics set up | All pages indexed or submitted; CWV pass |
| 2 | About, methodology page (formulas + sources), Privacy, Terms, Contact | E-E-A-T basics in place |
| 3 | Goal-pace pages batch 1 (about 6 marathon pages) | Indexed; unique tables verified |
| 4 | Pace chart page + Zone 2 page | Indexed |
| 5 | Age grading calculator (after licence check) | Tool works against published examples |
| 6 | Reddit and Strava participation running for 4 weeks; 1st outreach batch (20 clubs/coaches) | ≥ 3 replies; ≥ 1 natural link |
| 7 | Calories + VO2max estimator | Indexed |
| 8 | Goal-pace batch 2 (half marathon); review batch 1 impressions | Batch 1 showing impressions, otherwise pause programmatic work |
| 9 | Embeddable widget for pace/splits | ≥ 1 site embeds it |
| 10 | Product Hunt launch (12+ tools) | Launch done; feedback triaged |
| 11 | Apply for AdSense if baseline met; join Amazon Associates and Brooks (Impact) | Application submitted |
| 12 | Quarter review: re-score backlog with real Search Console data and keyword-tool volumes | Q2 plan written |

## 8. Risks

- **YMYL-adjacent topics** (heart rate, fueling). Mitigation: safety notes, sourced formulas, no medical claims, and named reviewers if any join later.
- **Thin programmatic pages.** Mitigation: the caveat rules in §3, plus noindexing pages that get no impressions.
- **Competitors copying formulas.** Our moat is UX, speed and trust, not the maths.
- **Solo bandwidth.** Mitigation: ship one tool per week at most, and give accuracy and maintenance priority over new pages.
