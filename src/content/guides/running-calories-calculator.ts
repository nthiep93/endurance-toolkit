import type { Guide } from "../types";

export const guide: Guide = {
  slug: "running-calories-calculator",
  intro:
    "This running calories calculator estimates the energy a run costs from your body weight, distance or duration, pace and incline, using the ACSM running equation, and compares it with the simple 1 kcal per kg per km rule of thumb. Use it to plan fueling for training and recovery.",
  howTo: [
    "Enter your body weight in kilograms or pounds.",
    "Choose whether to describe the run by distance and pace or by duration and pace, and pick km or miles.",
    "Add the average uphill incline in percent (0 for flat ground or a treadmill at 0%).",
    "Read the gross and net energy, compare them with the rule of thumb, and copy the result into your training log or fueling plan.",
  ],
  sections: [
    {
      heading: "How the calculation works",
      paragraphs: [
        "The American College of Sports Medicine (ACSM) running equation estimates oxygen uptake from speed and grade: VO2 = 0.2 × speed + 0.9 × speed × grade + 3.5, with speed in metres per minute, grade as a fraction and VO2 in ml/kg/min. The final 3.5 is resting metabolism (one MET). Multiplying by body weight gives litres of oxygen per minute, and each litre corresponds to roughly 5 kcal.",
        "Example: a 70 kg runner covering 10 km at 6:00/km runs at 166.7 m/min. VO2 = 0.2 × 166.7 + 3.5 = 36.8 ml/kg/min, or 2.58 L/min. Over 60 minutes that is 2.58 × 5 × 60 ≈ 774 kcal gross, of which 700 kcal is the net cost of running on top of resting metabolism.",
      ],
    },
    {
      heading: "Gross vs net energy, and the 1 kcal/kg/km rule",
      paragraphs: [
        "Gross energy is everything you burned during the run, including what your body would have used anyway at rest. Net energy is the extra cost of running. For fueling and recovery, net is the better measure of what the session added to your day; gross is what most watches and apps display.",
        "On flat ground the ACSM net cost works out to exactly 1 kcal per kg per km, the same as the popular rule of thumb. That's why the net number barely changes with pace: running a fixed distance faster costs a similar amount of energy, it just spends it in less time. Gross energy rises slightly at slower paces because the run lasts longer and resting metabolism keeps ticking.",
      ],
      table: {
        headers: ["10 km for a 70 kg runner", "Duration", "Gross kcal", "Net kcal"],
        rows: [
          ["5:00/km", "50:00", "761", "700"],
          ["5:30/km", "55:00", "767", "700"],
          ["6:00/km", "1:00:00", "774", "700"],
          ["7:00/km", "1:10:00", "786", "700"],
        ],
      },
    },
    {
      heading: "Body weight and distance",
      paragraphs: [
        "Because both terms scale with body mass, a heavier runner uses proportionally more energy to cover the same distance at the same pace. The table shows ACSM gross estimates at 6:00/km on flat ground, with the rule of thumb in brackets.",
      ],
      table: {
        headers: ["Body weight", "5 km", "10 km", "Half marathon", "Marathon"],
        rows: [
          ["55 kg", "304 (275)", "608 (550)", "1,282 (1,160)", "2,564 (2,321)"],
          ["70 kg", "387 (350)", "774 (700)", "1,632 (1,477)", "3,264 (2,954)"],
          ["85 kg", "470 (425)", "939 (850)", "1,982 (1,793)", "3,963 (3,587)"],
        ],
      },
    },
    {
      heading: "The effect of hills",
      paragraphs: [
        "Incline adds 0.9 × speed × grade to oxygen cost, so climbing is expensive. For the same 70 kg runner doing 10 km at 6:00/km, a steady 5% grade raises the estimate by about 20%. The equation is not designed for downhill running, which this calculator doesn't model; on rolling courses, use the average uphill grade or treat the flat estimate as a baseline.",
      ],
      table: {
        headers: ["Incline", "Gross kcal (10 km, 6:00/km, 70 kg)", "Net kcal"],
        rows: [
          ["0%", "774", "700"],
          ["2%", "837", "763"],
          ["5%", "931", "858"],
          ["8%", "1,026", "952"],
          ["10%", "1,089", "1,015"],
        ],
      },
    },
    {
      heading: "Using the numbers for training and recovery",
      paragraphs: [
        "Estimates vary ±20% between individuals: running economy, terrain, wind, heat and body composition all shift the real cost. Use the result to plan fuel rather than as a precise measurement.",
      ],
      bullets: [
        "Long runs and races: the carbohydrate share of energy rises with intensity, so a 3,000+ kcal marathon is why in-race fueling matters; see the race fueling calculator for gels and fluids.",
        "Recovery: after hard or long sessions, eat carbohydrate and protein within a few hours to restock glycogen and support muscle repair.",
        "High-volume weeks: add the net cost of each run to your normal needs so energy intake keeps pace with training; persistent under-fueling hurts performance, recovery and health.",
        "The ACSM equation is intended for running above about 8 km/h (7:28/km); for walking breaks or very slow jogging the estimate may run high.",
      ],
    },
  ],
  faqs: [
    {
      q: "How many calories does running 10 km use?",
      a: "About 1 kcal per kg of body weight per km, so roughly 700 kcal net for a 70 kg runner. The ACSM equation gives about 774 kcal gross at 6:00/km on the flat, including resting metabolism. Individual values vary by around ±20%.",
    },
    {
      q: "Does running faster burn more calories?",
      a: "Per minute yes, per kilometre barely. A 70 kg runner uses about 914 kcal per hour at 5:00/km versus 674 at 7:00/km, but over a fixed 10 km the net cost stays near 700 kcal because the faster run is shorter.",
    },
    {
      q: "What is the difference between gross and net calories?",
      a: "Gross calories are the total used during the run; net calories subtract what you would have burned at rest over the same time. Net shows what the run itself added, which is the useful number for planning extra fuel.",
    },
    {
      q: "How accurate is the ACSM running equation?",
      a: "It is a good population average for steady running on flat ground or treadmill inclines, but individual results commonly differ by ±20%. Economy, terrain, heat and wind change the real cost, and it isn't designed for downhill running or walking speeds.",
    },
    {
      q: "Are smartwatch calorie numbers more accurate?",
      a: "Not necessarily. Watches combine heart rate, pace and your profile with their own models, and studies often find errors of 20% or more. Use any estimate, including this one, as a guide for fueling rather than an exact figure.",
    },
  ],
  updated: "2026-11-25",
};
