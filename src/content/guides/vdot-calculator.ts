import type { Guide } from "../types";

export const guide: Guide = {
  slug: "vdot-calculator",
  intro:
    "This VDOT calculator turns a recent race into a single fitness score using the Daniels–Gilbert equations, then gives you matching Easy, Marathon, Threshold, Interval and Repetition training paces.",
  howTo: [
    "Select the distance of a recent race or all-out time trial between roughly 1.5 km and 50 km.",
    "Enter your finish time.",
    "Read your VDOT score and the five training pace ranges (E, M, T, I, R) per km and per mile.",
    "Plan your week so most running sits in the Easy range, with one or two quality sessions at T, I or R pace.",
  ],
  sections: [
    {
      heading: "What VDOT actually measures",
      paragraphs: [
        "VDOT is coach Jack Daniels' name for a 'pseudo VO2max' — the aerobic capacity your race performance implies, rather than a lab-measured value. It comes from two equations developed with physiologist Jimmy Gilbert. The first estimates the oxygen cost of running at a given speed (VO2 = −4.60 + 0.182258v + 0.000104v², with v in metres per minute). The second estimates what fraction of your maximum you can sustain for a race of a given duration — close to 100% for a 10-minute effort, around 80–85% for a three-hour marathon. Divide one by the other and you get VDOT.",
        "Because VDOT folds running economy into the number, two runners with identical lab VO2max can have different VDOTs. That is a feature: it reflects what you can actually do on the road, which is what training paces need to be based on.",
      ],
    },
    {
      heading: "VDOT and equivalent race times",
      paragraphs: [
        "Equivalent performances at selected VDOT values, solved from the same equations the calculator uses:",
      ],
      table: {
        headers: ["VDOT", "5K", "10K", "Half marathon", "Marathon"],
        rows: [
          ["30", "30:41", "1:03:49", "2:21:17", "4:49:49"],
          ["35", "26:59", "56:02", "2:04:13", "4:16:06"],
          ["40", "24:06", "50:01", "1:50:54", "3:49:37"],
          ["45", "21:49", "45:13", "1:40:14", "3:28:16"],
          ["50", "19:56", "41:20", "1:31:31", "3:10:40"],
          ["55", "18:22", "38:06", "1:24:16", "2:55:55"],
          ["60", "17:03", "35:22", "1:18:09", "2:43:22"],
        ],
      },
    },
    {
      heading: "The five training paces and what each one is for",
      paragraphs: [
        "Worked example: a 50:00 10K gives a VDOT of 40.0. The approximate pace ranges for that score are shown below; the calculator shows exact values for your own result, which can differ by a second or two from these because of rounding.",
      ],
      table: {
        headers: ["Pace", "Approx. intensity", "VDOT 40 example (/km)", "Typical use"],
        rows: [
          ["Easy (E)", "~59–69% VO2max", "6:11–6:59", "Most weekly volume, long runs, recovery"],
          ["Marathon (M)", "Goal marathon effort", "~5:27", "Marathon-pace blocks inside long runs"],
          ["Threshold (T)", "~86–88% VO2max", "5:06–5:11", "20–30 min tempo or 4–5 × 1.6 km cruise intervals"],
          ["Interval (I)", "~95–100% VO2max", "4:36–4:47", "3–5 min repeats, equal or shorter jog recovery"],
          ["Repetition (R)", "Faster than I", "4:19–4:23", "200–400 m reps for speed and economy, full recovery"],
        ],
      },
    },
    {
      heading: "Example week for a VDOT 40 runner",
      paragraphs: [
        "Here is how the paces fit into a balanced week of about 50–55 km for someone building toward a first marathon. Two quality days, one long run, and everything else easy. Notice that the hard running — threshold and interval work combined — is well under a fifth of the total volume.",
      ],
      table: {
        headers: ["Day", "Session", "Pace guide"],
        rows: [
          ["Mon", "Rest or 30 min very easy", "E (slow end)"],
          ["Tue", "2 km warm-up, 3 × 1.6 km at T with 1 min jog, 2 km cool-down", "T 5:06–5:11/km"],
          ["Wed", "8 km easy + 6 × 20 s strides", "E"],
          ["Thu", "Rest", "—"],
          ["Fri", "2 km warm-up, 5 × 3 min at I with 2 min jog, 2 km cool-down", "I 4:36–4:47/km"],
          ["Sat", "6 km easy", "E"],
          ["Sun", "18–22 km long run, last 5 km at M", "E, then M ~5:27/km"],
        ],
      },
    },
    {
      heading: "Common mistakes with VDOT paces",
      paragraphs: [
        "The most frequent mistake is running easy days too fast. The Easy range is wide on purpose; if your E runs creep to the fast edge every day, you will arrive at quality sessions tired and your threshold and interval work suffers.",
      ],
      bullets: [
        "Using a goal time instead of a current race. Train at the fitness you have; the paces will move as you improve.",
        "Inflating the input with a downhill or short course — every pace becomes too fast.",
        "Ignoring heat and hills. In hot, humid conditions run by effort and accept slower paces; the VDOT number assumes good conditions.",
        "Doing too much at I pace. Daniels' guideline is to keep a single interval session to roughly 8% of weekly volume, and threshold work to about 10%.",
        "Updating VDOT after every good workout. Raise it after a race or time trial, typically by no more than a point or so every few weeks.",
      ],
    },
    {
      heading: "How to use your VDOT over a training block",
      paragraphs: [
        "Start the block with paces from your most recent race. Every 4–6 weeks, run a tune-up race or a solo 5K time trial and recalculate. If the new VDOT is higher, shift your paces; if it is lower (illness, heat, a hard week), keep the old paces until you have a clearer result rather than chasing numbers.",
        "For marathon training, the M pace is a sanity check on your goal: if your goal pace is faster than the M pace your current VDOT implies, either the goal is aggressive or your input race underrates you. Cross-check with the race time predictor, which shows Riegel and VDOT equivalents side by side.",
      ],
    },
  ],
  faqs: [
    {
      q: "What is a good VDOT score?",
      a: "A good VDOT depends on age, sex and training history, but as a reference a VDOT of 40 matches a 50-minute 10K, 45 matches about a 45-minute 10K, and 50 matches a sub-20 5K. Many consistent recreational runners sit in the 35–50 range. Compare your score with your own earlier results rather than others'.",
    },
    {
      q: "Is VDOT the same as VO2max?",
      a: "No. VDOT is a performance-based estimate derived from race times, while VO2max is measured in a lab or estimated by a watch. VDOT includes running economy, so it reflects how efficiently you use your aerobic capacity. Two runners with identical VO2max can have different VDOTs and different race times.",
    },
    {
      q: "How is VDOT calculated?",
      a: "VDOT is calculated by dividing the oxygen cost of your race speed by the fraction of maximum you can sustain for that race duration. Both come from the Daniels–Gilbert equations. The calculator converts your distance and time into metres per minute, applies both formulas and reports the result to one decimal place.",
    },
    {
      q: "How fast should my easy runs be?",
      a: "Easy runs should be comfortably conversational, which on VDOT terms means roughly 59–69% of VO2max. For a runner with a 50-minute 10K (VDOT 40), that's about 6:11–6:59 per km. On hot days or after hard sessions, it is fine to run slower than the range.",
    },
    {
      q: "How often should I update my VDOT?",
      a: "Update your VDOT after a race or all-out time trial, roughly every 4–6 weeks during a training block. Avoid raising it based on a single good workout. Gradual changes of about one point at a time keep your training paces challenging but sustainable.",
    },
    {
      q: "What is threshold pace?",
      a: "Threshold pace is a comfortably hard effort you could hold for about an hour in a race, roughly 86–88% of VO2max in Daniels' system. It's used for tempo runs and cruise intervals that raise the speed you can sustain before fatigue builds rapidly. For a VDOT of 40 it's about 5:06–5:11 per km.",
    },
  ],
  updated: "2026-11-25",
};
