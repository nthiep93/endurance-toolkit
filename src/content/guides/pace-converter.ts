import type { Guide } from "../types";

export const guide: Guide = {
  slug: "pace-converter",
  intro:
    "Use this pace converter to switch instantly between min/km, min/mile, km/h and mph — the fastest way to turn an outdoor training pace into the number you punch into a treadmill.",
  howTo: [
    "Type a value into any one field: pace per km, pace per mile, km/h or mph.",
    "The other three units update immediately; paces are shown as m:ss and speeds to one decimal place.",
    "On a treadmill, set the speed shown in the unit your machine uses (most gyms use km/h outside the US, mph in the US).",
    "Use the conversion chart below the tool to see neighbouring paces at a glance.",
  ],
  sections: [
    {
      heading: "The conversion formulas",
      paragraphs: [
        "There are only two ideas behind every conversion. First, one mile is exactly 1.609344 km, so pace per mile = pace per km × 1.609344, and speed in mph = speed in km/h ÷ 1.609344. Second, pace and speed are reciprocals: km/h = 60 ÷ pace in minutes per km. A 5:00/km pace is 60 ÷ 5 = 12.0 km/h; a 5:30/km pace is 60 ÷ 5.5 ≈ 10.9 km/h.",
        "The one trap is that pace is written in minutes and seconds, not decimals. 5:30 means 5.5 minutes, and 5:45 means 5.75 minutes. Converting by hand with 5.30 or 5.45 gives answers that are quietly wrong by several seconds per km — the converter handles this for you.",
      ],
    },
    {
      heading: "Treadmill conversion chart (km/h)",
      paragraphs: [
        "Most treadmills outside the US show km/h and step in 0.1 km/h increments. These are the paces each speed produces:",
      ],
      table: {
        headers: ["Treadmill km/h", "Pace /km", "Pace /mile", "mph"],
        rows: [
          ["8.0", "7:30", "12:04", "5.0"],
          ["9.0", "6:40", "10:44", "5.6"],
          ["10.0", "6:00", "9:39", "6.2"],
          ["11.0", "5:27", "8:47", "6.8"],
          ["12.0", "5:00", "8:03", "7.5"],
          ["13.0", "4:37", "7:26", "8.1"],
          ["14.0", "4:17", "6:54", "8.7"],
          ["15.0", "4:00", "6:26", "9.3"],
          ["16.0", "3:45", "6:02", "9.9"],
        ],
      },
    },
    {
      heading: "Treadmill conversion chart (mph)",
      paragraphs: [
        "US treadmills show mph. Here is the same idea from the other side:",
      ],
      table: {
        headers: ["Treadmill mph", "Pace /mile", "Pace /km", "km/h"],
        rows: [
          ["5.0", "12:00", "7:27", "8.0"],
          ["5.5", "10:55", "6:47", "8.9"],
          ["6.0", "10:00", "6:13", "9.7"],
          ["6.5", "9:14", "5:44", "10.5"],
          ["7.0", "8:34", "5:20", "11.3"],
          ["7.5", "8:00", "4:58", "12.1"],
          ["8.0", "7:30", "4:40", "12.9"],
          ["9.0", "6:40", "4:09", "14.5"],
          ["10.0", "6:00", "3:44", "16.1"],
        ],
      },
    },
    {
      heading: "Worked example: a tempo run on the treadmill",
      paragraphs: [
        "Your plan calls for 20 minutes at 4:50/km. That is 4.833 minutes per km, so the speed is 60 ÷ 4.833 ≈ 12.4 km/h, or about 7.7 mph. Because treadmills only step in 0.1 increments, you will often land a second or two either side of the exact pace — 12.4 km/h is actually 4:50.3/km, which is close enough for any workout.",
        "Going the other way: if a friend's plan says '6 mph easy', that is 10:00 per mile or about 6:13 per km. Knowing that lets you check whether their easy pace is anywhere near yours before you copy the session.",
      ],
    },
    {
      heading: "Converting interval sessions between metric and imperial plans",
      paragraphs: [
        "Plans written in the US often prescribe mile repeats and paces per mile, while most of the world trains in kilometres and track metres. Converting the pace is only half the job — you also need the target time for each rep. Multiply pace per km by the rep length in km: 800 m at 4:30/km is 0.8 × 270 s = 3:36, and 400 m at 4:00/km is 1:36.",
        "On a standard 400 m track, lap time is the most practical target: divide your pace per km by 2.5. A 5:00/km tempo is a 2:00 lap, and a 4:00/km interval pace is a 1:36 lap. Remember that lane 1 is the measured lane; running in outer lanes adds distance on every bend.",
      ],
      table: {
        headers: ["Pace /km", "Pace /mile", "400 m rep", "800 m rep", "1 km rep", "1 mile rep"],
        rows: [
          ["4:00", "6:26", "1:36", "3:12", "4:00", "6:26"],
          ["4:30", "7:15", "1:48", "3:36", "4:30", "7:15"],
          ["5:00", "8:03", "2:00", "4:00", "5:00", "8:03"],
        ],
      },
    },
    {
      heading: "Why treadmill pace feels different from outdoor pace",
      paragraphs: [
        "A treadmill belt doesn't push you along, but there is no air resistance and no wind, the surface is perfectly even and the pace is forced on you. Many coaches suggest setting a 1% incline to roughly offset the missing air resistance at moderate speeds; at slow speeds the difference is small either way. Treat this as a rule of thumb, not physics.",
        "Calibration matters more than incline. Treadmill speed readouts can be off by a few percent, especially on older gym machines. If a pace that feels easy outdoors feels hard indoors (or the reverse), trust your effort and heart rate and use the converted number as a starting point rather than gospel. Indoor heat is the other big factor: without a fan, sweat doesn't evaporate and heart rate drifts up faster than it would outside.",
      ],
      bullets: [
        "Set 0.5–1% incline for runs where you want outdoor-equivalent effort.",
        "Use a fan; warm indoor air pushes heart rate up at the same pace.",
        "For intervals, start the belt a few seconds early — most machines take 5–10 seconds to reach speed.",
        "Compare a known treadmill pace with a footpod or a measured outdoor effort to sanity-check calibration.",
      ],
    },
  ],
  faqs: [
    {
      q: "How do I convert km/h to min/km?",
      a: "Divide 60 by the speed in km/h to get minutes per km. For example, 12 km/h is 60 ÷ 12 = 5.0 minutes, or 5:00 per km, and 10.5 km/h is 60 ÷ 10.5 ≈ 5.71 minutes, which is 5:43 per km. Convert the decimal part to seconds by multiplying by 60.",
    },
    {
      q: "What is 6 mph in minutes per mile?",
      a: "6 mph is a 10:00 per mile pace, because 60 minutes ÷ 6 miles = 10 minutes per mile. In metric that is about 6:13 per km or 9.7 km/h. It's a common easy-run speed for many recreational runners on a US treadmill.",
    },
    {
      q: "What treadmill speed is a 5:00/km pace?",
      a: "A 5:00/km pace is exactly 12.0 km/h, or about 7.5 mph. That pace equals 8:03 per mile and would produce a 25:00 5K or a 50:00 10K if held evenly. Set the treadmill to 12.0 km/h, and add a 1% incline if you want effort closer to outdoor running.",
    },
    {
      q: "Should I set a 1% incline on the treadmill?",
      a: "A 1% incline is a common rule of thumb to make treadmill running feel closer to outdoor effort, because there's no air resistance indoors. It matters most at faster paces. For easy runs it's optional; the bigger factors are machine calibration and indoor heat, so let effort and heart rate guide you.",
    },
    {
      q: "How do I convert min/mile to min/km?",
      a: "Divide the pace per mile by 1.609344. An 8:00 per mile pace is 480 seconds ÷ 1.609344 ≈ 298 seconds, or 4:58 per km. A 10:00 mile is 6:13 per km. The converter shows all four units at once so you don't need to do this by hand.",
    },
  ],
  updated: "2026-11-25",
};
