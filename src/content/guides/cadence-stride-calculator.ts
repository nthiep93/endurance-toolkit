import type { Guide } from "../types";

export const guide: Guide = {
  slug: "cadence-stride-calculator",
  intro:
    "This stride length calculator connects the three numbers behind every running pace — cadence, stride length and speed — so you can see how your form metrics add up and what it takes to run faster.",
  howTo: [
    "Choose what to solve: stride length, the cadence needed for a target pace, or the pace produced by a given cadence and stride.",
    "Enter your pace (min/km or min/mile) and your cadence in steps per minute, from your watch or by counting steps for 30 seconds and doubling.",
    "Read the result in metres (and feet), or as steps per minute or pace, depending on what you solved for.",
    "Compare numbers at easy pace and race pace — the change between them is more useful than any single value.",
  ],
  sections: [
    {
      heading: "The formula behind pace, cadence and stride",
      paragraphs: [
        "Speed is just steps per minute multiplied by the distance covered per step. Rearranged: stride length (m) = speed (m/min) ÷ cadence (steps/min). At 5:00/km you cover 1,000 m in 5 minutes, or 200 m per minute. At a cadence of 180 steps per minute, each step covers 200 ÷ 180 = 1.11 m. Run the same pace at 170 spm and each step must be 1.18 m long.",
        "A note on terms: this calculator measures the distance of a single step (left foot to right foot), which is what most watches report as 'stride length'. Some biomechanics texts define a stride as two steps — the same foot to the same foot — which doubles the number. If your watch shows about 1 m at easy pace, it is reporting step length, matching this tool.",
      ],
    },
    {
      heading: "Stride length at common paces and cadences",
      paragraphs: [
        "Step length (metres) needed for each combination of cadence and pace:",
      ],
      table: {
        headers: ["Cadence (spm)", "4:00/km (≈2:49 marathon)", "4:59/km (3:30 marathon)", "5:41/km (4:00 marathon)"],
        rows: [
          ["160", "1.56 m", "1.25 m", "1.10 m"],
          ["170", "1.47 m", "1.18 m", "1.04 m"],
          ["180", "1.39 m", "1.11 m", "0.98 m"],
          ["190", "1.32 m", "1.06 m", "0.93 m"],
        ],
      },
    },
    {
      heading: "The '180 steps per minute' myth",
      paragraphs: [
        "The famous 180 spm figure came from coach Jack Daniels counting the cadence of elite runners at the 1984 Olympics. Those athletes were racing at very fast speeds; cadence naturally rises with speed, and taller runners tend to sit lower. It was never meant as a universal target for easy runs. Many healthy recreational runners settle between about 155 and 175 spm at easy pace and reach the 180s only when running fast.",
        "Where cadence does help is overstriding — landing with the foot far ahead of the body, often with a straight knee and a heavy heel strike. Research on runners with this pattern suggests that a modest cadence increase of about 5–10% reduces the load at the knee and hip. If you are at 160 spm, try 168–170 for a few weeks, not 180 overnight. A metronome app or a music playlist at the target BPM is the simplest way to practise.",
      ],
    },
    {
      heading: "Worked example: how much faster is a 5% cadence increase?",
      paragraphs: [
        "Suppose you run 6:00/km at 165 spm. Your step length is 166.7 m/min ÷ 165 = 1.01 m. If you raise cadence by 5% to about 173 spm and keep the same step length, pace improves to roughly 5:43/km. In reality step length usually shortens slightly when you first increase cadence, so pace stays about the same while the effort feels lighter on the legs — which is the main goal.",
        "To get faster in the long run, you need both: a little more cadence and a bit more stride length from greater strength and power, not from reaching forward. Hill sprints, strides (20-second relaxed accelerations) and basic strength work improve push-off, which lengthens your step naturally behind your body rather than in front of it.",
      ],
    },
    {
      heading: "A four-week plan to raise cadence gradually",
      paragraphs: [
        "If you want to raise cadence, keep the change small and limited to part of your running at first. Example for a runner currently at 160 spm on easy runs, aiming for a 5% increase to 168 spm:",
      ],
      table: {
        headers: ["Week", "Target cadence", "How to practise"],
        rows: [
          ["1", "164 spm (+2.5%)", "Metronome on for 3 × 3 min during two easy runs"],
          ["2", "164 spm", "Metronome on for 10 min blocks, half of each easy run"],
          ["3", "168 spm (+5%)", "3 × 3 min blocks again at the new target"],
          ["4", "168 spm", "Whole easy run; check calves and Achilles feel normal"],
        ],
      },
    },
    {
      heading: "Common mistakes with cadence and stride data",
      paragraphs: [],
      bullets: [
        "Comparing your easy-run cadence with someone else's race cadence. Compare like with like.",
        "Forcing a big cadence jump at once, which can tighten calves and Achilles tendons. Change it gradually over several weeks.",
        "Reaching for a longer stride. Extra length should come from push-off, not landing further ahead.",
        "Trusting a single run. Wrist-based cadence is usually reliable, but stride length depends on GPS pace, so check trends on flat routes.",
        "Ignoring height and leg length. Taller runners usually have longer steps and lower cadence at the same pace — that's normal.",
      ],
    },
  ],
  faqs: [
    {
      q: "How do I calculate stride length?",
      a: "Divide your speed in metres per minute by your cadence in steps per minute. At 5:00/km you run 200 m per minute; at 180 steps per minute your stride (step) length is 200 ÷ 180 = 1.11 m. Your watch may report this automatically if it measures both cadence and GPS pace.",
    },
    {
      q: "What is a good running cadence?",
      a: "A good running cadence for most recreational runners is roughly 160–180 steps per minute, rising as pace increases. There's no single ideal; height, leg length and speed all matter. If you overstride or get recurring knee pain, a gradual 5–10% increase from your current cadence is a commonly recommended adjustment.",
    },
    {
      q: "Is 180 steps per minute the right cadence?",
      a: "Not for everyone. The 180 spm figure came from observations of elite runners racing at the 1984 Olympics, and cadence naturally rises with speed. Many recreational runners run comfortably at 160–175 spm on easy days. Use 180 as a reference point, not a rule.",
    },
    {
      q: "Does increasing cadence make you faster?",
      a: "Increasing cadence alone only makes you faster if your stride length stays the same, which rarely happens at first. Its main benefit is reducing overstriding and impact loading. Speed gains come from combining a slightly higher cadence with stronger push-off through strides, hills and strength work.",
    },
    {
      q: "What is the average stride length for running?",
      a: "Average running step length for recreational runners is roughly 0.9–1.3 m, depending on pace and height. At 6:00/km and 165 steps per minute, it's about 1.0 m; at 4:00/km and 180 spm, about 1.39 m. Faster running generally increases both step length and cadence.",
    },
    {
      q: "How do I measure my running cadence?",
      a: "Count how many times one foot hits the ground in 30 seconds and multiply by four, or count both feet for 30 seconds and double it. Most GPS watches and footpods measure cadence automatically. Measure on flat ground at a steady pace for a reliable number.",
    },
  ],
  updated: "2026-11-25",
};
