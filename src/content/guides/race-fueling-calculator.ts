import type { Guide } from "../types";

export const guide: Guide = {
  slug: "race-fueling-calculator",
  intro:
    "This marathon fueling calculator estimates how many carbs, gels and fluids you need on race day from your expected finish time, and builds a simple gel schedule you can practise in training.",
  howTo: [
    "Enter your expected finish time (use the race time predictor if you are unsure).",
    "Set a carbohydrate target per hour — 60 g/h is the default — and the carbs in your gel (25 g by default; check the label).",
    "Adjust fluid (default 500 ml/h) and sodium (default 400 mg/h) if you know your sweat rate or are racing in heat.",
    "Review the total carbs, number of gels, gel timing and fluid totals, then rehearse the plan on at least two long runs.",
  ],
  sections: [
    {
      heading: "Why marathon fueling matters",
      paragraphs: [
        "Your muscles and liver store a limited amount of carbohydrate as glycogen — enough for roughly 90–120 minutes of hard running for most people. In a marathon, running low on glycogen is what turns the last 10 km into a survival shuffle, the infamous 'wall'. Taking in carbohydrate during the race slows that depletion. It doesn't replace your stores, but it can be the difference between holding pace and fading after 30 km.",
        "Races under about an hour don't need in-race fuel, which is why the calculator returns zero gels for short efforts. For a half marathon of 1:45–2:15, one or two gels are optional but often helpful; for the marathon, a plan is essential.",
      ],
    },
    {
      heading: "How much carbohydrate per hour?",
      paragraphs: [
        "Sports nutrition guidelines commonly suggest 30–60 g of carbohydrate per hour for endurance events of 1–2.5 hours, and up to around 90 g per hour for longer events if you use products mixing glucose and fructose and have trained your gut. The calculator defaults to 60 g/h because it is achievable for most runners with ordinary gels. Treat 90 g/h as an advanced target to build up to, not a starting point.",
      ],
      table: {
        headers: ["Finish time", "Total carbs at 40 g/h", "At 60 g/h", "At 90 g/h", "Fluid at 500 ml/h"],
        rows: [
          ["1:30:00", "60 g", "90 g", "135 g", "750 ml"],
          ["2:00:00", "80 g", "120 g", "180 g", "1.0 L"],
          ["3:00:00", "120 g", "180 g", "270 g", "1.5 L"],
          ["3:30:00", "140 g", "210 g", "315 g", "1.75 L"],
          ["4:00:00", "160 g", "240 g", "360 g", "2.0 L"],
          ["4:30:00", "180 g", "270 g", "405 g", "2.25 L"],
          ["5:00:00", "200 g", "300 g", "450 g", "2.5 L"],
        ],
      },
    },
    {
      heading: "Worked example: a 4-hour marathon",
      paragraphs: [
        "At 60 g/h, a 4:00 marathon works out to 240 g of carbohydrate in total if you fuel for the whole race. With 25 g gels, 60 g/h means one gel every 25 minutes. In practice you don't need anything in the first 30–45 minutes, so the calculator starts the schedule there: gels at 35, 60, 85, 110, 135, 160, 185 and 210 minutes — about eight gels and 200 g of carbs. Sports drink taken at aid stations counts toward the total, so some runners carry six gels and fill the gap with drink.",
        "Fluid at 500 ml/h adds up to about 2 litres over four hours — roughly 150–200 ml at each of the aid stations on a typical course. Take each gel with water rather than sports drink if you want to avoid a very concentrated sugar load in the stomach.",
      ],
    },
    {
      heading: "Common fueling mistakes",
      paragraphs: [],
      bullets: [
        "Trying anything new on race day. Use the exact gel brand and flavour in long runs first; the course's own gels may not suit you.",
        "Waiting until you feel tired. By then you are already behind — fuel on schedule from the start of the plan.",
        "Taking gels too close together to 'catch up', which often causes stomach trouble.",
        "Drinking far more than you sweat. Overdrinking plain water in long, slow races can be dangerous; drink to a plan and to thirst, not as much as possible.",
        "Ignoring sodium in heat. In hot, humid races sweat losses rise sharply; electrolyte drinks or salt tabs help many runners, but test them in training.",
        "Forgetting the label. Gels range from about 20 g to 40 g of carbohydrate; change the gel-size input to match yours.",
      ],
    },
    {
      heading: "Race-week and race-morning checklist",
      paragraphs: [
        "In-race fuel works best on top of full glycogen stores. These steps cover the 48 hours before the start.",
      ],
      bullets: [
        "Raise carbohydrate intake for the last 1–2 days; sports nutrition guidance often cites around 8–12 g per kg of body weight per day for marathon carb-loading — practise it before a long run first.",
        "Eat a familiar, low-fibre breakfast 2–4 hours before the start; many runners aim for roughly 1–2 g of carbohydrate per kg.",
        "Check the race's official aid-station map: note which stations have sports drink, which have gels and how far apart they are.",
        "Pack gels so they are easy to reach with sweaty fingers, and tear the tops slightly if your hands struggle with packaging.",
        "Line up gel timings with aid stations so you can take each one with water.",
      ],
    },
    {
      heading: "Practise first, and get personal advice if you need it",
      paragraphs: [
        "Treat the numbers as a starting plan, not a prescription. Practise race-day fueling on at least two or three long runs at marathon pace, and increase carbs per hour gradually — the gut adapts with training. If you have diabetes, a gastrointestinal condition or a history of severe cramping or hyponatraemia, talk to a doctor or a registered sports dietitian before race day. A simple sweat test (weigh yourself before and after an hour's run, accounting for what you drank) gives a much better fluid target than any default.",
      ],
    },
  ],
  faqs: [
    {
      q: "How many gels do I need for a marathon?",
      a: "Most runners need about 6–10 gels for a marathon, depending on finish time and gel size. At 60 g of carbs per hour with 25 g gels, that's one gel every 25 minutes after the first 30–45 minutes — about eight gels for a 4-hour marathon. Sports drink at aid stations can replace one or two.",
    },
    {
      q: "How many carbs per hour should I eat while running?",
      a: "Aim for about 30–60 g of carbohydrate per hour for races of 1–2.5 hours, and 60–90 g per hour for longer events if your gut is trained. Start around 60 g/h and build up in training. Higher intakes work best with products that combine glucose and fructose.",
    },
    {
      q: "When should I take my first gel in a marathon?",
      a: "Take your first gel around 30–45 minutes into a marathon, then continue at regular intervals such as every 20–30 minutes. Starting early helps you stay ahead of glycogen depletion. Taking it with water at an aid station makes it easier to digest.",
    },
    {
      q: "Do I need gels for a half marathon?",
      a: "Gels are optional for a half marathon but useful if you'll be running longer than about 90 minutes. One or two gels, for example around 45 and 75 minutes, give many runners a stronger finish. Under an hour, in-race fuel is generally unnecessary.",
    },
    {
      q: "How much water should I drink during a marathon?",
      a: "Most runners do well with roughly 400–800 ml of fluid per hour, adjusted for heat and personal sweat rate; the calculator defaults to 500 ml. Drinking to a plan and to thirst is safer than drinking as much as possible. A pre- and post-run weigh-in helps estimate your own needs.",
    },
    {
      q: "Can I train my gut to handle more carbs?",
      a: "Yes. Gradually increasing carbohydrate intake during long runs over several weeks improves how much your gut can absorb and tolerate. Start at a comfortable amount, add about 10 g per hour every week or two, and always use the products you plan to race with.",
    },
  ],
  updated: "2026-11-25",
};
