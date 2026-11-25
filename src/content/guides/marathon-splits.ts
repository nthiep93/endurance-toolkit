import type { Guide } from "../types";

export const guide: Guide = {
  slug: "marathon-splits",
  intro:
    "This marathon split calculator turns a goal time into a km-by-km or mile-by-mile plan with even or negative splits, so you know exactly where you should be at every marker on race day.",
  howTo: [
    "Choose the race distance (marathon, half marathon or any custom distance).",
    "Enter your goal finish time.",
    "Pick split units — km or mile — and a strategy: even pace, or a negative split with a chosen percentage difference between halves.",
    "Review the table of split times, pace and cumulative time, then print it as a pace band or save the key checkpoints to your watch.",
  ],
  sections: [
    {
      heading: "Even vs negative splits",
      paragraphs: [
        "An even split means the same pace from start to finish. A negative split means running the second half faster than the first. In this calculator, a negative split of N% makes the first half N/2% slower than even pace and the second half N/2% faster, so the total still lands exactly on your goal.",
        "For most runners the honest target is 'even to slightly negative'. Going out fast to 'bank time' is the classic marathon mistake: the extra seconds you save in the first 10 km are usually repaid with interest after 30 km, when glycogen runs low. A small negative split protects you from that and leaves room to finish strongly.",
      ],
    },
    {
      heading: "Checkpoint times for 3:30 and 4:00 (even pace)",
      paragraphs: [
        "These are the cumulative times you should see at each 5 km mat for two popular goals. A 3:30:00 marathon averages 4:59/km (8:01/mile); a 4:00:00 marathon averages 5:41/km (9:09/mile).",
      ],
      table: {
        headers: ["Marker", "3:30:00 goal", "4:00:00 goal"],
        rows: [
          ["5 km", "24:53", "28:26"],
          ["10 km", "49:46", "56:53"],
          ["15 km", "1:14:39", "1:25:19"],
          ["20 km", "1:39:32", "1:53:45"],
          ["Half (21.1 km)", "1:45:00", "2:00:00"],
          ["25 km", "2:04:25", "2:22:12"],
          ["30 km", "2:29:18", "2:50:38"],
          ["35 km", "2:54:11", "3:19:05"],
          ["40 km", "3:19:05", "3:47:31"],
          ["Finish (42.195 km)", "3:30:00", "4:00:00"],
        ],
      },
    },
    {
      heading: "Worked example: a 2% negative split",
      paragraphs: [
        "With a 4:00:00 goal and a 2% negative split, each half is adjusted by 1%. The first half becomes 2:01:12 (about 5:45/km) and the second half 1:58:48 (about 5:38/km). The difference is only seven seconds per km, which feels almost too easy early on — and that is the point. For a 3:30:00 goal, the same 2% gives halves of 1:46:03 and 1:43:57, roughly 5:02/km then 4:56/km.",
        "Keep the percentage small. A 2–3% negative split is plenty for a marathon; anything larger usually means the first half was too conservative or the goal was too soft. On a hilly course or a hot morning, even effort matters more than even pace, so let pace drift on climbs and watch the cumulative time at each 5 km rather than every single split.",
      ],
      table: {
        headers: ["Goal", "Split", "First half", "Second half", "Pace 1st / 2nd half"],
        rows: [
          ["4:00:00", "Even", "2:00:00", "2:00:00", "5:41 / 5:41 per km"],
          ["4:00:00", "2% negative", "2:01:12", "1:58:48", "5:45 / 5:38 per km"],
          ["3:30:00", "Even", "1:45:00", "1:45:00", "4:59 / 4:59 per km"],
          ["3:30:00", "2% negative", "1:46:03", "1:43:57", "5:02 / 4:56 per km"],
        ],
      },
    },
    {
      heading: "Half marathon checkpoints",
      paragraphs: [
        "The same planning applies to the half marathon, where a too-fast first 5 km is just as costly. Even-pace cumulative times for three common goals:",
      ],
      table: {
        headers: ["Goal", "Pace /km", "5 km", "10 km", "15 km", "20 km"],
        rows: [
          ["1:30:00", "4:16", "21:20", "42:40", "1:03:59", "1:25:19"],
          ["1:45:00", "4:59", "24:53", "49:46", "1:14:39", "1:39:32"],
          ["2:00:00", "5:41", "28:26", "56:53", "1:25:19", "1:53:45"],
        ],
      },
    },
    {
      heading: "Common pacing mistakes",
      paragraphs: [],
      bullets: [
        "Pacing off your watch's distance. GPS typically measures races 0.5–1% long, so by 40 km your watch can be 200–400 m ahead of the official markers. Pace off the course markers and the cumulative times above.",
        "Chasing lost seconds after a slow water station or a crowded start. Spread any deficit over the next 10 km instead of sprinting the next kilometre.",
        "Ignoring the weather. In heat and humidity, start 10–20 s/km slower than your cool-weather goal; you will rarely regret it.",
        "Planning splits for a goal your training doesn't support. Check it with the race time predictor first.",
      ],
    },
    {
      heading: "Using your split plan on race day",
      paragraphs: [
        "Print the table as a pace band or write four or five checkpoints on your arm — 10 km, half, 30 km and 35 km are the ones that matter. Set your watch to show lap time per km so you can compare against the plan without doing mental arithmetic late in the race.",
        "Pair your splits with a fueling plan: gels are easiest to take at predictable points such as every 5 km aid station. The race fueling calculator gives you a timing schedule you can line up with the same markers.",
        "Rehearse the plan before race day. A long run of 26–32 km with the final 8–10 km at goal pace tells you whether the split plan is realistic; if holding the second-half pace feels like a race effort in training, move the goal back by a few minutes now rather than discovering it at 35 km. Running the first 5 km of that session slightly slower than goal pace is also good practice for the discipline the race will demand.",
      ],
    },
  ],
  faqs: [
    {
      q: "What is a negative split in running?",
      a: "A negative split means running the second half of a race faster than the first. In a 4:00 marathon with a 2% negative split, you'd reach halfway in about 2:01:12 and run the second half in 1:58:48. It's widely recommended because it prevents the early overpacing that causes late-race slowdowns.",
    },
    {
      q: "What should my halfway split be for a sub-4 marathon?",
      a: "For a sub-4 marathon, aim to reach halfway in about 1:59–2:01. Even pace gives exactly 2:00:00 at halfway, while a small 2% negative split puts you around 2:01:12. Anything much faster than 1:58 at halfway risks a slow final 10 km unless you are fitter than your goal.",
    },
    {
      q: "Is it better to run even or negative splits?",
      a: "For most marathoners, an even or slightly negative split (1–3%) produces the best result. It keeps effort controlled while glycogen lasts longer. Large negative splits often mean the first half was too slow, while positive splits usually come from starting too fast.",
    },
    {
      q: "What pace do I need for a 3:30 marathon?",
      a: "A 3:30 marathon requires an average pace of 4:59 per km or 8:01 per mile. At even pace you'd pass 10 km in 49:46, halfway in 1:45:00 and 30 km in 2:29:18. Because GPS usually reads long, many runners target 4:55–4:57 per km on their watch.",
    },
    {
      q: "How do I make a marathon pace band?",
      a: "Enter your goal time and choose km or mile splits, then print the split table and cut it into a strip to wear on your wrist. Keep it simple: cumulative times at every 5 km are easier to read mid-race than every single split. Some runners write key checkpoints directly on their forearm.",
    },
  ],
  updated: "2026-11-25",
};
