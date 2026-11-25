import type { Guide } from "../types";

export const guide: Guide = {
  slug: "heart-rate-zones",
  intro:
    "This heart rate zone calculator gives you five running training zones from your maximum and resting heart rate, using either the Karvonen (heart rate reserve) method or a simple percentage of max HR.",
  howTo: [
    "Enter your maximum heart rate if you know it from a hard race or field test; otherwise enter your age and pick an estimate formula (Tanaka is a sensible default).",
    "Enter your resting heart rate, measured lying down just after waking, ideally averaged over a few mornings.",
    "Choose Karvonen (uses resting HR) or % of max HR.",
    "Copy the five zones into your watch or training app and check them against how the efforts actually feel over a couple of weeks.",
  ],
  sections: [
    {
      heading: "Estimating maximum heart rate",
      paragraphs: [
        "Every zone is anchored to max HR, so this number matters most. The calculator offers three age-based formulas: Fox (220 − age), Tanaka (208 − 0.7 × age) and Gellish (207 − 0.7 × age). They agree closely around age 40 and diverge for younger and older runners, as the table shows.",
        "All three are population averages. Individual max HR commonly varies by 10 beats or more either side of any formula, and it does not reflect fitness — a high max HR is not 'better'. If you have seen a higher number on your watch during the final sprint of a hard 5K, and the reading looked clean (chest strap, no spikes at the start of the run), use that instead.",
      ],
      table: {
        headers: ["Age", "Fox (220 − age)", "Tanaka (208 − 0.7 × age)", "Gellish (207 − 0.7 × age)"],
        rows: [
          ["25", "195", "190.5", "189.5"],
          ["35", "185", "183.5", "182.5"],
          ["45", "175", "176.5", "175.5"],
          ["55", "165", "169.5", "168.5"],
        ],
      },
    },
    {
      heading: "Karvonen vs % of max: a worked example",
      paragraphs: [
        "Karvonen uses heart rate reserve (HRR = max − rest), then adds resting HR back: target = rest + % × (max − rest). The % of max method simply multiplies max HR by the percentage. Both use the same bands here: 50–60, 60–70, 70–80, 80–90 and 90–100%.",
        "Take a runner with a max HR of 185 and resting HR of 55, so HRR = 130. Zone 2 by Karvonen is 55 + 0.6 × 130 = 133 to 55 + 0.7 × 130 = 146 bpm. By % of max it is 0.6 × 185 = 111 to 0.7 × 185 = 130 bpm. That gap is why the two methods feel so different: % of max zones are lower at the bottom end, and for a fit runner with a low resting HR, a % of max Zone 2 can feel like walking.",
      ],
      table: {
        headers: ["Zone", "Purpose", "Karvonen (max 185, rest 55)", "% of max (max 185)"],
        rows: [
          ["1 (50–60%)", "Recovery, warm-up", "120–133 bpm", "93–111 bpm"],
          ["2 (60–70%)", "Easy aerobic base, long runs", "133–146 bpm", "111–130 bpm"],
          ["3 (70–80%)", "Steady / marathon effort", "146–159 bpm", "130–148 bpm"],
          ["4 (80–90%)", "Threshold, tempo", "159–172 bpm", "148–167 bpm"],
          ["5 (90–100%)", "VO2max intervals, race finish", "172–185 bpm", "167–185 bpm"],
        ],
      },
    },
    {
      heading: "Which method should you use?",
      paragraphs: [
        "If you know your resting heart rate, Karvonen is usually the better choice for runners because it scales the zones to your own range, not just the ceiling. Use % of max if you don't have a reliable resting value, or if your coach or plan was written using % of max — mixing systems is a common way to end up training at the wrong intensity.",
        "Whichever you choose, the zones are a starting point. Cross-check them with effort: Zone 2 should allow full sentences, Zone 4 should allow only a few words, and Zone 5 is reserved for short repeats. If the numbers and the feel disagree for weeks, adjust the max HR input rather than forcing the effort to match.",
      ],
    },
    {
      heading: "Common mistakes with heart rate training",
      paragraphs: [],
      bullets: [
        "Trusting wrist readings in intervals. Optical sensors lag and can lock onto cadence; a chest strap is more reliable for hard efforts.",
        "Forgetting cardiac drift. On long or hot runs, heart rate rises 5–15 bpm at the same pace. In tropical heat and humidity, accept slower paces to stay in zone.",
        "Measuring resting HR after coffee or while sitting at a desk — it will be too high and every Karvonen zone will shift up.",
        "Judging a single run. Heart rate is affected by sleep, stress, caffeine and illness; look at trends over weeks.",
        "Never updating. Re-check resting HR every month or two during a training block; it often drops a few beats as fitness improves.",
      ],
    },
    {
      heading: "How to use your zones in a training week",
      paragraphs: [
        "A simple and widely used pattern is to keep roughly 80% of your weekly running time in Zones 1–2 and the remaining 20% in Zones 3–5. For a runner training five hours a week, that means about four hours easy and one hour of combined tempo, interval and race-pace work. Zone 3 is the one to watch: it feels productive, but if every easy run drifts into it you collect fatigue without the benefits of truly easy or truly hard sessions.",
        "During intervals, heart rate lags behind effort by 30–60 seconds, so for short repeats run by pace or feel and use heart rate only to confirm you recovered between reps.",
      ],
    },
    {
      heading: "A note on safety",
      paragraphs: [
        "These zones are training estimates, not medical advice. If you take medication that affects heart rate (beta blockers, for example), have a heart condition, or notice chest pain, dizziness or unusual breathlessness during exercise, stop and speak to a doctor before using heart rate targets. A clinically supervised exercise test is the most accurate way to find your true max HR and safe training ranges.",
      ],
    },
  ],
  faqs: [
    {
      q: "What is the Karvonen formula?",
      a: "The Karvonen formula sets a target heart rate as resting HR plus a percentage of heart rate reserve: target = rest + % × (max − rest). With max 185 and rest 55, 70% is 55 + 0.7 × 130 = 146 bpm. It personalises zones better than % of max because it accounts for your resting heart rate.",
    },
    {
      q: "What is my Zone 2 heart rate?",
      a: "Zone 2 is 60–70% of your heart rate reserve (Karvonen) or 60–70% of max HR. For a 35-year-old with a max of 185 and resting HR of 55, that's about 133–146 bpm with Karvonen. It should feel easy enough to hold a full conversation for an hour or more.",
    },
    {
      q: "Which max heart rate formula is most accurate?",
      a: "Tanaka (208 − 0.7 × age) and Gellish (207 − 0.7 × age) are generally considered more accurate than the classic 220 − age, especially for runners over about 40. All formulas are averages, though, and your true max can differ by 10 or more beats. A recent hard race finish gives a better personal estimate.",
    },
    {
      q: "Why is my heart rate so high on easy runs?",
      a: "High heart rate on easy runs is usually caused by running too fast, heat and humidity, dehydration, poor sleep, caffeine or a wrist sensor misreading. Cardiac drift also adds 5–15 bpm over long runs. Slow down until you are in zone; aerobic fitness improves and the pace at that heart rate rises over weeks.",
    },
    {
      q: "How do I measure my resting heart rate?",
      a: "Measure resting heart rate lying down right after waking, before coffee or getting out of bed, using a watch or by counting your pulse for 60 seconds. Average three to five mornings for a reliable number. Many sports watches also report an overnight resting value you can use.",
    },
    {
      q: "Should I train by heart rate or pace?",
      a: "Use both. Pace is precise for workouts and races, while heart rate shows how hard your body is working on a given day, which is useful for easy runs, heat and hills. A common approach is to cap easy runs by heart rate and run quality sessions by pace.",
    },
  ],
  updated: "2026-11-25",
};
