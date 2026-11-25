import type { Guide } from "../types";

export const guide: Guide = {
  slug: "pace-calculator",
  intro:
    "This running pace calculator solves the missing piece of any run: enter two of distance, time and pace, and it returns the third in both min/km and min/mile, plus speed in km/h and mph.",
  howTo: [
    "Pick a distance from the race presets (5K, 10K, half marathon, marathon) or type a custom distance in kilometres or miles.",
    "Enter a finish time as h:mm:ss (for example 1:55:00) or a pace as m:ss per km or per mile — leave the field you want solved empty.",
    "Read the result: pace per km and per mile, total time, and the equivalent speed in km/h and mph for treadmill use.",
    "Change one input at a time to see how much a few seconds per km moves your finish time.",
  ],
  sections: [
    {
      heading: "How pace, time and distance relate",
      paragraphs: [
        "Pace is simply time divided by distance. A 10K run in 55:00 is 3,300 seconds over 10 km, or 330 seconds per km — 5:30/km. Flip it around and you get the other two answers: distance × pace gives finish time, and time ÷ pace gives distance. The calculator does exactly this arithmetic, using 1 mile = 1.609344 km for conversions, so the only real source of error is the numbers you type in.",
        "Speed is the reciprocal of pace. 5:30/km means you cover 60 ÷ 5.5 ≈ 10.9 km every hour. Runners think in pace because it maps directly onto a watch split; treadmills and cyclists think in speed. Showing both saves a second trip to a converter.",
      ],
    },
    {
      heading: "Pace chart: per-km pace and what it means for common races",
      paragraphs: [
        "The table below shows even-pace finish times. Use it as a quick reality check: if your goal marathon time sits two rows faster than your current 10K pace, the goal is probably too ambitious for this training block.",
      ],
      table: {
        headers: ["Pace /km", "Pace /mile", "Speed (km/h)", "5K", "10K", "Half marathon", "Marathon"],
        rows: [
          ["4:00", "6:26", "15.0", "20:00", "40:00", "1:24:23", "2:48:47"],
          ["4:30", "7:15", "13.3", "22:30", "45:00", "1:34:56", "3:09:53"],
          ["5:00", "8:03", "12.0", "25:00", "50:00", "1:45:29", "3:30:59"],
          ["5:30", "8:51", "10.9", "27:30", "55:00", "1:56:02", "3:52:04"],
          ["6:00", "9:39", "10.0", "30:00", "1:00:00", "2:06:35", "4:13:10"],
          ["6:30", "10:28", "9.2", "32:30", "1:05:00", "2:17:08", "4:34:16"],
          ["7:00", "11:16", "8.6", "35:00", "1:10:00", "2:27:41", "4:55:22"],
          ["7:30", "12:04", "8.0", "37:30", "1:15:00", "2:38:14", "5:16:28"],
        ],
      },
    },
    {
      heading: "Worked example: what pace do I need for a goal time?",
      paragraphs: [
        "Say your target is a 1:55:00 half marathon. The half is 21.0975 km, so 6,900 seconds ÷ 21.0975 km = 327 seconds per km, or 5:27/km (8:46/mile). Notice how small the margins are: running 5:30/km instead finishes in 1:56:02, a full minute slower for just three seconds per km. That is why pace bands and split plans matter more than they seem.",
        "Now the reverse. You ran an easy 1:10:00 at 6:20/km and want to know how far you went: 4,200 ÷ 380 = 11.05 km. This is handy when GPS drops out under trees or between tall buildings and you trust your watch's timer more than its distance.",
      ],
    },
    {
      heading: "Half marathon goal pace table",
      paragraphs: [
        "The half marathon is the most common 'step up' race, and goal times cluster around round numbers. These are the even paces each one requires. Five minutes of finish time is worth roughly 14 seconds per km at this distance, which is a useful mental shortcut when you are deciding between two goals.",
      ],
      table: {
        headers: ["Goal time", "Pace /km", "Pace /mile"],
        rows: [
          ["1:30:00", "4:16", "6:52"],
          ["1:35:00", "4:30", "7:15"],
          ["1:40:00", "4:44", "7:38"],
          ["1:45:00", "4:59", "8:01"],
          ["1:50:00", "5:13", "8:23"],
          ["1:55:00", "5:27", "8:46"],
          ["2:00:00", "5:41", "9:09"],
          ["2:15:00", "6:24", "10:18"],
        ],
      },
    },
    {
      heading: "Common mistakes when calculating pace",
      paragraphs: [
        "Most pace errors come from units and from optimism rather than maths.",
      ],
      bullets: [
        "Treating a half marathon as 21 km or a marathon as 42 km. The missing 195 metres of a marathon costs about 70 seconds at 6:00/km.",
        "Planning for the certified distance only. Real races measure long on your watch because nobody runs the perfect tangent line — budget for 0.5–1% extra, or about 200–400 m in a marathon.",
        "Typing 5.30 for five and a half minutes. Pace is minutes:seconds, so 5:30 is 5.5 minutes, not 5.3.",
        "Using a pace you hit once in training as a race pace. Base goals on races or sustained tempo efforts, not your best single kilometre.",
        "Ignoring conditions. Heat, humidity and hills slow everyone; in a hot, humid climate an early-morning race can still feel 10–20 s/km harder than the same effort in cool weather.",
      ],
    },
    {
      heading: "How to use your pace result in training",
      paragraphs: [
        "A goal pace is only useful if you practise it. Once you have your number, put it into specific sessions: marathon-pace segments inside long runs (for example 3 × 5 km at goal pace with 1 km easy between), or tempo runs a little faster than half-marathon pace. Most of your weekly kilometres should still be clearly slower than goal pace — easy running builds the aerobic base that makes race pace feel sustainable.",
        "For race day, take the pace from this calculator to the marathon split calculator to get a km-by-km plan, and use the race time predictor to check whether a recent 10K or half supports the goal at all. If the predictor says 4:05 and you want 3:45, the gap is roughly 30 seconds per km — a whole training cycle, not a race-day decision.",
      ],
    },
  ],
  faqs: [
    {
      q: "How do I calculate my running pace?",
      a: "Divide your time by your distance. For example, 50 minutes for 10 km is 50 ÷ 10 = 5 minutes per km, or 5:00/km. To get pace per mile, multiply the per-km pace by 1.609344, so 5:00/km becomes about 8:03/mile. The calculator does both conversions instantly and also shows speed in km/h and mph.",
    },
    {
      q: "What is a good running pace for a beginner?",
      a: "A good beginner pace is one you can hold while still speaking in full sentences, which for many new runners falls somewhere between 6:30 and 8:00 per km (about 10:30–13:00 per mile). Pace depends heavily on age, body weight and background, so judge progress against your own earlier runs, not against other people.",
    },
    {
      q: "What pace is a 4-hour marathon?",
      a: "A 4-hour marathon needs an average pace of 5:41 per km, or 9:09 per mile. Because GPS usually measures a race slightly long, many runners aim for 5:35–5:38/km on their watch to leave a buffer. Halfway at even pace is 2:00:00; a slight negative split would be closer to 2:01 at halfway.",
    },
    {
      q: "How do I convert min/km to min/mile?",
      a: "Multiply your pace per km by 1.609344. A 6:00/km pace is 360 seconds × 1.609344 ≈ 579 seconds, which is 9:39 per mile. To go the other way, divide pace per mile by 1.609344. The pace converter tool does this for any pace and also gives treadmill speeds.",
    },
    {
      q: "Why does my watch show a different pace than the calculator?",
      a: "Your watch measures the distance you actually ran with GPS, which drifts and usually reads 0.5–2% long in races because you don't run perfect tangents. The calculator uses the exact distance you enter. Over a marathon that difference can add several hundred metres, so trust official splits over your watch's average pace.",
    },
    {
      q: "Is a faster pace always better in training?",
      a: "No. Most training should be at an easy, conversational pace, often 60–90 seconds per km slower than 5K race pace. Running every session hard limits recovery and increases injury risk. Reserve faster paces for one or two structured workouts per week, such as tempo runs or intervals.",
    },
  ],
  updated: "2026-11-25",
};
