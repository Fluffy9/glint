export type CompareRow = {
  label: string;
  glint: string;
  theirs: string;
  /** Which cell to emphasize. Even leaves both in body weight. */
  lean: "glint" | "even";
};

export type CompetitorSource = {
  label: string;
  href: string;
};

export type Competitor = {
  slug: string;
  name: string;
  /** Search-facing first paragraph. Prices are US list prices as of October 2026. */
  intro: string;
  rows: CompareRow[];
  /** Short note under the links. */
  checked: string;
  sources: CompetitorSource[];
};

const glintPrice = "$69.99 once";
const glintKeep = "Optional encrypted backup, $10 a year. The band keeps working without it.";
const glintScreen = "None. You read it on your phone.";
const glintBattery = "Days of wear between charges.";
const glintRecord = "On your phone until you send a copy. No feed.";

export const competitors: Competitor[] = [
  {
    slug: "whoop",
    name: "Whoop",
    intro:
      "Whoop is a screenless band you cannot buy on its own. A membership starts at $199 a year and the band comes with it. Peak is $239 a year. Life is $359 a year. Glint is $69.99 once.",
    rows: [
      {
        label: "Band",
        glint: glintPrice,
        theirs: "No one-time price. The band ships with the membership.",
        lean: "glint",
      },
      {
        label: "To keep it",
        glint: glintKeep,
        theirs: "Yearly membership required: One $199/year, Peak $239/year, or Life $359/year.",
        lean: "glint",
      },
      { label: "Screen", glint: glintScreen, theirs: "None. Stats live in the Whoop app.", lean: "even" },
      { label: "Battery", glint: glintBattery, theirs: "14+ days on Whoop 5.0.", lean: "even" },
      {
        label: "Record",
        glint: glintRecord,
        theirs: "Whoop account and app, for as long as you are a member.",
        lean: "glint",
      },
    ],
    checked: "US prices, checked October 2026. Plans change.",
    sources: [
      { label: "Whoop membership", href: "https://www.whoop.com/us/en/membership/" },
      { label: "Whoop Peak", href: "https://www.whoop.com/us/en/peak/" },
      { label: "Whoop Life", href: "https://www.whoop.com/us/en/life/" },
    ],
  },
  {
    slug: "fitbit-air",
    name: "Fitbit Air",
    intro:
      "Fitbit Air is Google’s screenless band. The tracker is $99.99 once and includes three months of Google Health Premium. After that, Premium is optional at $9.99 a month or $99.99 a year if you want the coach. Core tracking does not need it.",
    rows: [
      {
        label: "Band",
        glint: glintPrice,
        theirs: "$99.99 once. Special Edition $129.99 once.",
        lean: "glint",
      },
      {
        label: "To keep it",
        glint: glintKeep,
        theirs:
          "Core tracking with a free Google account. Health Premium is optional at $9.99/month or $99.99/year.",
        lean: "glint",
      },
      { label: "Screen", glint: glintScreen, theirs: "None. Stats live in the Google Health app.", lean: "even" },
      {
        label: "Battery",
        glint: glintBattery,
        theirs: "Up to 7 days. A five-minute charge is about another day.",
        lean: "even",
      },
      { label: "Record", glint: glintRecord, theirs: "Google Health account.", lean: "glint" },
    ],
    checked: "US prices, checked October 2026.",
    sources: [
      {
        label: "Google Store · Fitbit Air",
        href: "https://store.google.com/product/google_fitbit_air?hl=en-US",
      },
      {
        label: "Fitbit Air announcement",
        href: "https://blog.google/products-and-platforms/devices/fitbit/fitbit-air/",
      },
    ],
  },
  {
    slug: "helio-strap",
    name: "Helio Strap",
    intro:
      "The Amazfit Helio Strap is a screenless band at $99.99 once, with no subscription. Heart rate, sleep, and training load show up in the Zepp app. Glint is the same idea for less, and the record stays on your phone until you send a copy.",
    rows: [
      { label: "Band", glint: glintPrice, theirs: "$99.99 once.", lean: "glint" },
      { label: "To keep it", glint: glintKeep, theirs: "No subscription. One payment.", lean: "even" },
      { label: "Screen", glint: glintScreen, theirs: "None. Stats live in the Zepp app.", lean: "even" },
      { label: "Battery", glint: glintBattery, theirs: "Up to 10 days.", lean: "even" },
      { label: "Record", glint: glintRecord, theirs: "Zepp account.", lean: "glint" },
    ],
    checked: "US price, checked October 2026.",
    sources: [{ label: "Amazfit · Helio Strap", href: "https://us.amazfit.com/products/helio-strap" }],
  },
  {
    slug: "polar-loop",
    name: "Polar Loop",
    intro:
      "Polar Loop is a screenless band at $199.99 once, with no subscription. Battery is rated up to 8 days. Glint costs less up front and does not add a membership to keep the band working.",
    rows: [
      { label: "Band", glint: glintPrice, theirs: "$199.99 once.", lean: "glint" },
      { label: "To keep it", glint: glintKeep, theirs: "No subscription. One payment.", lean: "even" },
      { label: "Screen", glint: glintScreen, theirs: "None. Stats live in Polar’s app.", lean: "even" },
      { label: "Battery", glint: glintBattery, theirs: "Up to 8 days.", lean: "even" },
      { label: "Record", glint: glintRecord, theirs: "Polar account.", lean: "glint" },
    ],
    checked: "US price, checked October 2026.",
    sources: [{ label: "Polar · Loop", href: "https://www.polar.com/us-en/loop" }],
  },
];

export function competitorBySlug(slug: string): Competitor | undefined {
  return competitors.find((competitor) => competitor.slug === slug);
}
