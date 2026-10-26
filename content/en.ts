import type { CompareRow, CompetitorSource } from "@/lib/competitors";

/**
 * English copy. Slots: {name} {amount} {bandPrice} {backupPrice} {competitor} {mode}.
 * Add content/ja.ts later and switch the export in content/index.ts.
 * Prices are filled from lib/prices.ts, not typed here.
 */
export const en = {
  meta: {
    description: "{name} is a screenless fitness band. The band is {bandPrice} once.",
  },
  nav: {
    site: "Site",
    pricing: "Pricing",
    privacy: "Privacy",
    security: "Security",
    signIn: "Sign in",
    footer: "Footer",
    bandColour: "Band colour",
    switchMode: "Switch to {mode} mode",
    getTheBand: "[ Get the band ]",
    dragToTurn: "Packaging box, drag to turn",
  },
  footer: {
    builtBy: "built by",
    shop: "Shop",
    trust: "Trust",
    compare: "Compare",
    home: "Home",
    vs: "vs {competitor}",
  },
  hero: {
    title: "A band with no screen.",
    lede: "You wear it. Heart rate, sleep, and movement stay on the phone until you decide a copy should leave.",
    priceNote: "{amount} usd once",
  },
  features: {
    heading: "Fitness tracking that just works",
    lede: "You buy the band once, keep the data, and skip the subscription theatre.",
    items: [
      {
        id: "no-bs",
        title: "No BS",
        body: "Plain language about what the band stores and what leaves the phone.",
      },
      {
        id: "screenless",
        title: "No screen",
        body: "Nothing on your wrist to check mid-run. The band keeps the record.",
      },
      {
        id: "offline",
        title: "Works offline",
        body: "Tracking stays on the phone. Backup is optional, and you can skip it.",
      },
      {
        id: "battery",
        title: "Long battery",
        body: "Days of wear between charges, not another nightly dock ritual.",
      },
      {
        id: "lock",
        title: "Encrypted data",
        body: "On the phone by default. Optional backup is scrambled before it goes out.",
      },
      {
        id: "not-for-sale",
        title: "Never sold",
        body: "Your heart rate is not a product, a feed, or an ad target.",
      },
      {
        id: "export",
        title: "Export anytime",
        body: "Take a CSV or JSON copy whenever you want, including a plain file to Google Drive.",
      },
      {
        id: "trash",
        title: "Delete anytime",
        body: "Turn a category off and that copy is gone. Delete the account and so are we.",
      },
    ],
  },
  compare: {
    heading: "{name} vs the usual stack",
    lede: "Whoop bills by the year. Fitbit Air, Helio Strap, and Polar Loop sell the band once. {name} is {bandPrice} once.",
    window: "Side by side",
    column: "{name}",
    cardTitle: "{name} vs {competitor}",
    sources: "Sources:",
    openPage: "Open the {competitor} page.",
    pricingLink: "{name} pricing.",
    glintOnce: "{bandPrice} once",
    glintKeep: "Optional encrypted backup, {backupPrice} a year. The band keeps working without it.",
    glintScreen: "None. You read it on your phone.",
    glintBattery: "Days of wear between charges.",
    glintRecord: "On your phone until you send a copy. No feed.",
  },
  competitors: [
    {
      slug: "whoop",
      name: "Whoop",
      intro:
        "Whoop is a screenless band you cannot buy on its own. A membership starts at $199 a year and the band comes with it. Peak is $239 a year. Life is $359 a year. {name} is {bandPrice} once.",
      rows: [
        {
          label: "Band",
          glint: "{bandPrice} once",
          theirs: "No one-time price. The band ships with the membership.",
          lean: "glint",
        },
        {
          label: "To keep it",
          glint: "{keep}",
          theirs: "Yearly membership required: One $199/year, Peak $239/year, or Life $359/year.",
          lean: "glint",
        },
        { label: "Screen", glint: "{screen}", theirs: "None. Stats live in the Whoop app.", lean: "even" },
        { label: "Battery", glint: "{battery}", theirs: "14+ days on Whoop 5.0.", lean: "even" },
        {
          label: "Record",
          glint: "{record}",
          theirs: "Whoop account and app, for as long as you are a member.",
          lean: "glint",
        },
      ] satisfies CompareRow[],
      checked: "US prices, checked October 2026. Plans change.",
      sources: [
        { label: "Whoop membership", href: "https://www.whoop.com/us/en/membership/" },
        { label: "Whoop Peak", href: "https://www.whoop.com/us/en/peak/" },
        { label: "Whoop Life", href: "https://www.whoop.com/us/en/life/" },
      ] satisfies CompetitorSource[],
    },
    {
      slug: "fitbit-air",
      name: "Fitbit Air",
      intro:
        "Fitbit Air is Google’s screenless band. The tracker is $99.99 once and includes three months of Google Health Premium. After that, Premium is optional at $9.99 a month or $99.99 a year if you want the coach. Core tracking does not need it.",
      rows: [
        {
          label: "Band",
          glint: "{bandPrice} once",
          theirs: "$99.99 once. Special Edition $129.99 once.",
          lean: "glint",
        },
        {
          label: "To keep it",
          glint: "{keep}",
          theirs:
            "Core tracking with a free Google account. Health Premium is optional at $9.99/month or $99.99/year.",
          lean: "glint",
        },
        { label: "Screen", glint: "{screen}", theirs: "None. Stats live in the Google Health app.", lean: "even" },
        {
          label: "Battery",
          glint: "{battery}",
          theirs: "Up to 7 days. A five-minute charge is about another day.",
          lean: "even",
        },
        { label: "Record", glint: "{record}", theirs: "Google Health account.", lean: "glint" },
      ] satisfies CompareRow[],
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
      ] satisfies CompetitorSource[],
    },
    {
      slug: "helio-strap",
      name: "Helio Strap",
      intro:
        "The Amazfit Helio Strap is a screenless band at $99.99 once, with no subscription. Heart rate, sleep, and training load show up in the Zepp app. {name} is the same idea for less, and the record stays on your phone until you send a copy.",
      rows: [
        { label: "Band", glint: "{bandPrice} once", theirs: "$99.99 once.", lean: "glint" },
        { label: "To keep it", glint: "{keep}", theirs: "No subscription. One payment.", lean: "even" },
        { label: "Screen", glint: "{screen}", theirs: "None. Stats live in the Zepp app.", lean: "even" },
        { label: "Battery", glint: "{battery}", theirs: "Up to 10 days.", lean: "even" },
        { label: "Record", glint: "{record}", theirs: "Zepp account.", lean: "glint" },
      ] satisfies CompareRow[],
      checked: "US price, checked October 2026.",
      sources: [{ label: "Amazfit · Helio Strap", href: "https://us.amazfit.com/products/helio-strap" }],
    },
    {
      slug: "polar-loop",
      name: "Polar Loop",
      intro:
        "Polar Loop is a screenless band at $199.99 once, with no subscription. Battery is rated up to 8 days. {name} costs less up front and does not add a membership to keep the band working.",
      rows: [
        { label: "Band", glint: "{bandPrice} once", theirs: "$199.99 once.", lean: "glint" },
        { label: "To keep it", glint: "{keep}", theirs: "No subscription. One payment.", lean: "even" },
        { label: "Screen", glint: "{screen}", theirs: "None. Stats live in Polar’s app.", lean: "even" },
        { label: "Battery", glint: "{battery}", theirs: "Up to 8 days.", lean: "even" },
        { label: "Record", glint: "{record}", theirs: "Polar account.", lean: "glint" },
      ] satisfies CompareRow[],
      checked: "US price, checked October 2026.",
      sources: [{ label: "Polar · Loop", href: "https://www.polar.com/us-en/loop" }],
    },
  ],
  faq: {
    heading: "Questions",
    lede: "Short answers. Open one if you want the rest of the sentence.",
    items: [
      {
        question: "How much does {name} cost?",
        answer: ["The band is {bandPrice} once. ", { href: "/pricing", label: "See pricing" }, " for the full bill."],
      },
      {
        question: "Is there a subscription?",
        answer: ["No. Optional encrypted backup is {backupPrice} a year. The band keeps working if you skip it."],
      },
      {
        question: "Why is there no screen?",
        answer: [
          "So your wrist stays quiet. Heart rate, sleep, and movement land on your phone. You look when you want to.",
        ],
      },
      {
        question: "Where does my data live?",
        answer: [
          "On your phone by default. If you turn on backup, a scrambled copy leaves the phone. We store ciphertext only. The site unlocks it with your password when you want to look. ",
          { href: "/privacy", label: "Privacy" },
          " has the longer version.",
        ],
      },
      {
        question: "What if I forget my password?",
        answer: [
          "Then the backup stays locked. We cannot reset it into something we can read. Keep the band’s copy on your phone, or export a plain copy to Google Drive or a file before you lose the password.",
        ],
      },
      {
        question: "Do you sell my data?",
        answer: ["No. We do not sell your data. We also cannot read your backup."],
      },
      {
        question: "Can I export or delete my data?",
        answer: [
          "Yes. Export a CSV or JSON anytime, including a plain copy to Google Drive if you want one you can open without {name}. Turn a category off and that copy is gone. Delete the account and so are we.",
        ],
      },
    ],
  },
  pricing: {
    title: "Pricing",
    description: "The band is {bandPrice} once. Backup is {backupPrice} a year, and it is optional.",
    heading: "What you pay",
    band: "The band",
    bandBody: "Once. The band works with no subscription.",
    backup: "Backup",
    unit: "usd",
    backupUnit: "usd / year",
    backupBody: [
      "Optional. Backup leaves the phone scrambled. Cancel it and the band still works. ",
      { href: "/privacy", label: "How encryption works." },
    ],
  },
  privacy: {
    title: "Privacy",
    description: "What {name} stores today, and how encrypted backup works.",
    blocks: [
      {
        p: "This website takes payment through Stripe. We store the email on the order, whether you bought the band, whether backup is on, and the status of that subscription. We do not collect heart rate, sleep, or activity here as plaintext.",
      },
      { h: "On the phone" },
      { p: "Tracking starts on your phone. A new phone does not have that copy until you restore it." },
      { h: "When backup is on" },
      {
        p: "Backup is always encrypted before it leaves the phone. We store ciphertext only. We cannot read it. Another company cannot pull a readable copy from us.",
      },
      {
        p: "The website unlocks that copy with your password so you can see charts while you are signed in. The password is how decryption works. A password reset does not unlock old backup. If you lose the password and you do not have the phone copy or an export, that backup is gone.",
      },
      { h: "Exports" },
      {
        p: "You can export a plain CSV or JSON anytime, including to Google Drive or another place you pick. That export is not scrambled. Treat it like any other file you own.",
      },
      { h: "Other apps" },
      { p: "An app on your phone can receive a category from the phone. The phone already has the samples." },
      {
        p: "Turning a category off deletes the copy we were allowed to hold. Deleting the account deletes the copies we have.",
      },
      {
        p: ["We do not sell your data. ", { href: "/security", label: "Security" }, " lists what this site does today."],
      },
    ],
  },
  security: {
    title: "Security",
    description: "How {name} protects payments, and how encrypted backup works.",
    blocks: [
      { h: "Payments" },
      {
        p: "Card numbers stay at Stripe. Checkout is Stripe's page. {name} stores the order email, whether you bought the band and backup, and the subscription status.",
      },
      { h: "This website" },
      {
        p: "The production site is served over HTTPS. This website does not load third-party ads or analytics. {name} does not sell customer data.",
      },
      { h: "When you store health data with {name}" },
      {
        p: "Backup is encrypted on your phone before it is uploaded. We store ciphertext only. A database backup does not reveal readable samples.",
      },
      {
        p: "The website decrypts with your password so charts can load while you are signed in. Resetting the password does not unlock old ciphertext. Keep the copy on your phone, or export a plain file, if you want a way back without that password.",
      },
      {
        p: "You will be able to delete the account, and {name} will delete the copies it holds. That action is not on this website yet.",
      },
      { p: ["The same rules are written in plain language on ", { href: "/privacy", label: "Privacy" }, "."] },
    ],
  },
  login: {
    title: "Sign in",
    description: "Sign in to a {name} account.",
    body: "An account is where a backup lives after you choose to send a copy off the phone. Sign-in is not open on this site yet.",
    pricing: "See pricing",
  },
  checkout: {
    successTitle: "Order received",
    successBody:
      "Stripe has the payment. The band works without backup. If you added backup, you can cancel it and the band still works.",
    back: "Back to {name}",
    cancelTitle: "Checkout canceled",
    cancelBody: "No charge was made.",
  },
} as const;
