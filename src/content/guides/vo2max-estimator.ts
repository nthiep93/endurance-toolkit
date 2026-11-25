import type { Guide } from "../types";

export const guide: Guide = {
  slug: "vo2max-estimator",
  intro:
    "This VO2max estimator gives you an approximate maximal oxygen uptake from a recent race (as a VDOT score), a Cooper 12-minute test or your heart rate ratio, then shows a rough fitness category and the race times that level of aerobic fitness can support.",
  howTo: [
    "Pick a method: a recent all-out race result, a Cooper 12-minute test, or your measured max and resting heart rate.",
    "Enter the race distance and finish time, the distance you covered in 12 minutes (metres or miles), or your two heart rate values.",
    "Add your age and sex so the estimate can be placed in a coarse, rough-guide fitness category.",
    "Read your VO2max estimate, check the equivalent 5K, 10K, half and marathon times, and copy the results to compare after your next training block.",
  ],
  sections: [
    {
      heading: "What VO2max is (and what it isn't)",
      paragraphs: [
        "VO2max is the highest rate at which your body can take up and use oxygen during hard exercise, expressed in millilitres of oxygen per kilogram of body weight per minute (ml/kg/min). It sets the ceiling of your aerobic engine. Untrained adults are often in the 30s, trained recreational runners in the 40s and 50s, and elite distance runners in the 70s and 80s.",
        "It is only one of three pillars of endurance performance. The other two are running economy (how much oxygen a given pace costs you) and the fraction of VO2max you can sustain for the race distance, which is closely linked to lactate threshold. Two runners with the same VO2max can race very differently, which is why a race result is often a better guide to running fitness than a lab number.",
      ],
    },
    {
      heading: "Three ways to estimate it",
      paragraphs: [
        "Race result (VDOT). Jack Daniels and Jimmy Gilbert's equations convert a race time into VDOT, an 'effective VO2max': the VO2max that would explain your performance if your economy were typical. It bakes economy and endurance into one score, so it's the most useful number for setting training paces and predicting races.",
        "Cooper 12-minute test. Run as far as you can in 12 minutes, ideally on a 400 m track, and plug the distance into VO2max = (distance in metres − 504.9) / 44.73. It needs a well-paced, truly maximal effort; going out too fast is the most common way to under-score.",
        "Heart-rate ratio. The Uth–Sørensen formula estimates VO2max ≈ 15.3 × HRmax / HRrest. It needs no hard run, but it is only as good as your inputs: an age-predicted max heart rate can easily be 10 bpm off, which moves the estimate by several points.",
      ],
      table: {
        headers: ["Cooper distance (12 min)", "Estimated VO2max", "Heart rate (max / rest)", "Estimated VO2max"],
        rows: [
          ["1,600 m", "24.5", "175 / 70 bpm", "38.3"],
          ["2,000 m", "33.4", "180 / 60 bpm", "45.9"],
          ["2,400 m", "42.4", "185 / 55 bpm", "51.5"],
          ["2,800 m", "51.3", "190 / 50 bpm", "58.1"],
          ["3,200 m", "60.3", "195 / 45 bpm", "66.3"],
        ],
      },
    },
    {
      heading: "From VO2max to race potential",
      paragraphs: [
        "The calculator treats your estimate as a VDOT and solves the Daniels–Gilbert equations for 5K, 10K, half marathon and marathon times. If you used the race method, these are your equivalent performances at other distances. If you used the Cooper or heart rate method, read them as an upper bound: they assume average running economy and full endurance training for each distance.",
        "Predictions are only shown for efforts between roughly 3.5 minutes and 5 hours, the range the equations were fitted to.",
      ],
      table: {
        headers: ["VO2max / VDOT", "5K", "10K", "Half marathon", "Marathon"],
        rows: [
          ["35", "26:59", "56:02", "2:04:13", "4:16:06"],
          ["42.4", "22:57", "47:35", "1:45:30", "3:38:50"],
          ["50", "19:56", "41:20", "1:31:31", "3:10:40"],
          ["58.1", "17:31", "36:21", "1:20:21", "2:47:55"],
        ],
      },
    },
    {
      heading: "Reading the fitness category",
      paragraphs: [
        "The category table is a deliberately coarse rough guide with four bands — below average, average, good and excellent — by sex and age decade. The cut-offs are rounded from commonly cited adult norms such as Cooper Institute and ACSM-style tables, which were measured in lab tests on mostly non-athletic populations. Different sources disagree by several points, so treat a result near a boundary as sitting between two categories, not as a verdict.",
        "VO2max naturally declines with age, typically by around 10% per decade in sedentary adults and more slowly in people who keep training, which is why the bands step down with each age group.",
      ],
    },
    {
      heading: "How to raise your VO2max",
      paragraphs: [
        "Most of the gains come from consistent aerobic volume: plenty of easy running builds the heart's stroke volume and the capillary and mitochondrial density of your muscles. On top of that base, one weekly session of 3–5 minute intervals at roughly 95–100% of VO2max (Daniels' I pace, about 3K–5K race effort) is the most direct stimulus.",
      ],
      bullets: [
        "Retest every 6–8 weeks with the same method and conditions so the numbers are comparable.",
        "Expect bigger early gains if you are new to structured training, and small changes once you've trained for years.",
        "Heat, altitude, fatigue and illness all depress a test result; don't chase a number on a bad day.",
        "Check with a doctor before an all-out test if you have a heart condition or any symptoms during exercise.",
      ],
    },
  ],
  faqs: [
    {
      q: "Is VDOT the same as VO2max?",
      a: "No, VDOT is an effective VO2max derived from race performance, not a lab measurement. It combines your aerobic capacity with running economy and endurance, so a runner with excellent economy can have a VDOT higher than their measured VO2max, and vice versa.",
    },
    {
      q: "How accurate is the Cooper 12-minute test?",
      a: "Reasonably accurate for a group, with typical errors of a few ml/kg/min for an individual who paces well. Running 2,400 m gives (2400 − 504.9) / 44.73 ≈ 42.4 ml/kg/min. Poor pacing, a crowded track or wind will lower your score.",
    },
    {
      q: "Can I estimate VO2max without running?",
      a: "Yes, the heart-rate ratio method (VO2max ≈ 15.3 × HRmax / HRrest) needs only your max and resting heart rate. With a max of 190 and a resting rate of 50 bpm it gives about 58.1 ml/kg/min. It is the least precise of the three methods, especially with an age-predicted max.",
    },
    {
      q: "What is a good VO2max for a runner?",
      a: "For recreational runners, the mid-40s to 50s ml/kg/min is good to very good, and above 60 is typical of competitive club runners. Elite men are often in the 70s or 80s and elite women in the 60s or 70s. Age and sex shift these ranges, so compare yourself with the rough-guide table for your group.",
    },
    {
      q: "Why does my watch show a different VO2max?",
      a: "Watches use their own models based on pace and heart rate during runs, so they differ from formula and race-based estimates. All of these are estimates; the trend over months, measured the same way, matters far more than any single value.",
    },
  ],
  updated: "2026-11-25",
};
