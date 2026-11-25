import type { Guide } from "../types";

export const guide: Guide = {
  slug: "race-time-predictor",
  intro:
    "This race time predictor takes one recent race result and estimates your equivalent 5K, 10K, half marathon and marathon times using two proven models: the Riegel formula and Daniels' VDOT equivalents.",
  howTo: [
    "Choose the distance of a recent, all-out race or time trial (ideally within the last 6–8 weeks).",
    "Enter your finish time as h:mm:ss or mm:ss.",
    "Compare the Riegel and VDOT predictions for each distance, along with the implied average pace.",
    "Treat the prediction as the ceiling for a well-trained runner, and adjust for your actual long-run mileage, course and weather.",
  ],
  sections: [
    {
      heading: "How the predictions are calculated",
      paragraphs: [
        "The Riegel formula, published by engineer Peter Riegel in 1977, says that T2 = T1 × (D2 ÷ D1)^1.06. The exponent of 1.06 captures fatigue: double the distance and your time more than doubles, by about 4%. It is simple, transparent and works well between roughly 5K and the half marathon.",
        "The second column uses the Daniels–Gilbert equations behind VDOT. Your race is converted to an oxygen-cost score, then the calculator solves for the time at each other distance that produces the same score. Because the model accounts for how long you can sustain a given fraction of your aerobic capacity, its answers drift from Riegel's by anywhere from a few seconds to a couple of minutes, in either direction depending on the distances involved. Showing both gives you a realistic range rather than false precision.",
      ],
    },
    {
      heading: "Worked examples: three runners, two models",
      paragraphs: [
        "Here is what both models predict from common recent results. Times are rounded to the nearest second.",
      ],
      table: {
        headers: ["Recent race", "Target", "Riegel (1.06)", "VDOT equivalent"],
        rows: [
          ["5K in 25:00", "10K", "52:07", "51:53"],
          ["5K in 25:00", "Marathon", "3:59:47", "3:57:55"],
          ["10K in 50:00", "Half marathon", "1:50:19", "1:50:52"],
          ["10K in 50:00", "Marathon", "3:50:01", "3:49:34"],
          ["Half in 1:45:00", "10K", "47:35", "47:22"],
          ["Half in 1:45:00", "Marathon", "3:38:55", "3:37:50"],
        ],
      },
    },
    {
      heading: "Why marathon predictions are often too optimistic",
      paragraphs: [
        "Both models assume you are equally trained for every distance. For a 5K or 10K, a few months of consistent running gets you most of the way there. The marathon is different: finishing near your predicted time depends on long-run volume, fueling and pacing discipline. Many recreational runners on 30–40 km per week finish well slower than a 10K-based prediction, because they run out of glycogen or leg durability after 30 km rather than aerobic fitness.",
        "A practical adjustment: if your weekly volume is modest or your longest run is under 30 km, add 5–10% to the marathon prediction. Using the example above, a runner with a 50:00 10K might plan for roughly 4:00–4:10 on a first marathon rather than 3:50. Predicting from a half marathon is more reliable than predicting from a 5K, simply because the effort is closer to the marathon.",
      ],
    },
    {
      heading: "Turning a prediction into A, B and C goals",
      paragraphs: [
        "Rather than committing to one number, many coaches set three goals. The A goal is the prediction itself and only comes into play on a perfect day. The B goal adds a few percent and is the realistic target. The C goal is the result you would still be happy with if the weather turns. From a 1:45:00 half marathon, the Riegel marathon prediction gives a ladder like this:",
        "Decide in advance which goal you are starting at, based on the forecast and how your last long runs went. Starting at A pace and hoping to hold on is how B and C goals get missed too; starting at B pace and finishing fast is how A goals are occasionally reached.",
      ],
      table: {
        headers: ["Goal", "Adjustment", "Marathon time", "Pace /km"],
        rows: [
          ["A (perfect day)", "Prediction", "3:38:55", "5:11"],
          ["B (realistic)", "+3%", "3:45:29", "5:21"],
          ["C (hot or windy day)", "+5–8%", "3:49:52–3:56:26", "5:27–5:36"],
        ],
      },
    },
    {
      heading: "Getting an accurate input",
      paragraphs: [
        "The prediction can only be as good as the race you feed it. Small errors at short distances multiply over longer ones.",
      ],
      bullets: [
        "Use a race or solo time trial run at full effort, not a training run.",
        "Prefer recent results — fitness changes noticeably over 2–3 months.",
        "Avoid races on very hilly courses, in strong heat, or with known short or long measurement.",
        "Use the longest race you have run recently; a half predicts a marathon better than a 5K does.",
        "If two recent races disagree, the longer one usually reflects your endurance more honestly.",
      ],
    },
    {
      heading: "How to use your prediction",
      paragraphs: [
        "Use the predicted time as an upper bound when setting a goal, then check it against your training. If your marathon-pace long-run segments feel controlled at the predicted pace, the goal is realistic. If they feel like a struggle at 25 km, aim lower.",
        "Next, put your result into the VDOT calculator to get training paces that match your current fitness, and into the marathon split calculator to turn the goal time into a km-by-km plan. Re-run the predictor after every tune-up race in your build; a 10K or half three to six weeks before the marathon is the most useful checkpoint you have.",
      ],
    },
  ],
  faqs: [
    {
      q: "How accurate is the Riegel formula?",
      a: "The Riegel formula is usually accurate within a few percent between 5K and the half marathon, provided you're trained for both distances. It becomes less reliable for the marathon, where many recreational runners finish 5–10% slower than predicted because of limited long-run volume, fueling or heat. Use it as a best-case estimate.",
    },
    {
      q: "Can I predict my marathon time from a 5K?",
      a: "You can, but it's the least reliable prediction. A 25:00 5K predicts about 3:58–4:00 for the marathon, which assumes full marathon-specific training. A half marathon or 10K run within the last two months gives a better estimate, because those efforts test the endurance the marathon actually demands.",
    },
    {
      q: "What marathon time does a 50-minute 10K predict?",
      a: "A 50:00 10K predicts a marathon of about 3:50, with Riegel giving 3:50:01 and VDOT giving 3:49:34. That assumes thorough marathon training. Runners on lower weekly mileage or running their first marathon often finish closer to 4:00–4:10, so build in a buffer when choosing your goal.",
    },
    {
      q: "What is the difference between Riegel and VDOT predictions?",
      a: "Riegel uses a single fatigue exponent (1.06) applied to distance, while VDOT models how oxygen cost and sustainable effort change with race duration. They usually agree within a minute or two up to the half marathon. Seeing both helps you set a sensible range rather than chasing a single precise number.",
    },
    {
      q: "What does a 1:45 half marathon predict for a full marathon?",
      a: "A 1:45:00 half marathon predicts roughly 3:38–3:39 for the marathon: 3:38:55 with Riegel and 3:37:50 with VDOT. Doubling your half time and adding 10–20 minutes is a common rule of thumb that lands in a similar place, around 3:40–3:50 for most well-prepared runners.",
    },
    {
      q: "How often should I recalculate my predicted race times?",
      a: "Recalculate after every race or time trial, or roughly every 4–6 weeks during a training block. Fitness changes gradually, and updated predictions keep your goal pace and training paces realistic. A tune-up race 3–6 weeks before your goal race is the most useful checkpoint.",
    },
  ],
  updated: "2026-11-25",
};
