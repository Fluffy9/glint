import type { CompareRow, CompetitorSource } from "@/lib/competitors";

/**
 * English copy. Slots: {name} {amount} {bandPrice} {backupPrice} {competitor} {mode}.
 * Add content/ja.ts later and switch the export in content/index.ts.
 * Prices are filled from lib/prices.ts, not typed here.
 *
 * Rewrite notes (pre-launch, local first):
 * - Anything not built yet says so ("Coming soon"). Remove the label when it ships.
 * - Nothing here depends on the final hardware. Battery is "to be announced" until measured.
 * - // CONFIRM marks a sentence that is only true if the product works that way.
 */
export const en = {
  meta: {
    description: "{name} is a screenless fitness band that keeps your data in your browser first.",
  },
  nav: {
    site: "Site",
    pricing: "Pricing",
    privacy: "Privacy",
    security: "Security",
    dashboard: "Dashboard",
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
    lede: "You wear it. Heart rate, sleep, and movement stay in your browser first, and only leave if you choose to back them up.",
    priceNote: "planned {amount} usd once",
  },
  features: {
    heading: "Fitness tracking that just works",
    lede: "You buy the band once, keep the data, and skip the subscription theatre.",
    items: [
      {
        id: "no-bs",
        title: "No BS",
        body: "Plain language about what the band stores and what leaves this browser. No ads, no streaks nagging you.",
      },
      {
        id: "screenless",
        title: "No screen",
        body: "Nothing on your wrist to check mid-run. You look when you want to.",
      },
      {
        id: "offline",
        title: "Local first",
        body: "Your data lives in this browser and works without a connection. Backup is optional, and you can skip it.",
      },
      {
        id: "no-account",
        title: "No account",
        body: "The dashboard is free. It lives in this browser, with no sign-in.",
      },
      {
        id: "lock",
        title: "Encrypted backup",
        body: "This browser encrypts a copy, then backup uploads ciphertext only.",
      },
      {
        id: "not-for-sale",
        title: "Never sold",
        body: "Your heart rate is not a product, a feed, or an ad target.",
      },
      {
        id: "export",
        title: "Export anytime",
        body: "Take a plain CSV or JSON copy of your data whenever you want. Coming soon: send it straight to Google Drive.",
      },
      {
        id: "trash",
        title: "Delete anytime",
        body: "Wipe this browser whenever you want. A new payment does not unwrap old ciphertext.",
      },
    ],
  },
  compare: {
    heading: "{name} vs the usual stack",
    lede: "Whoop bills by the year. Fitbit Air, Helio Strap, and Polar Loop sell the band once. {name} plans to be {bandPrice} once.",
    window: "Side by side",
    column: "{name}",
    cardTitle: "{name} vs {competitor}",
    sources: "Sources:",
    openPage: "Open the {competitor} page.",
    pricingLink: "{name} pricing.",
    glintOnce: "{bandPrice} once (planned)",
    glintKeep: "Optional encrypted backup, {backupPrice} a year. The band keeps working without it.",
    glintScreen: "None. You read it in your browser.",
    glintBattery: "To be announced.",
    glintRecord: "In your browser first. A copy leaves only if you turn on backup. No feed.",
  },
  competitors: [
    {
      slug: "whoop",
      name: "Whoop",
      intro:
        "Whoop is a screenless band you cannot buy on its own. A membership starts at $199 a year and the band comes with it. Peak is $239 a year. Life is $359 a year. {name} plans to be {bandPrice} once.",
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
        { label: "Record", glint: "{record}", theirs: "Whoop account and app.", lean: "glint" },
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
            "Core tracking works with a free Google account. Health Premium is optional at $9.99/month or $99.99/year.",
          lean: "glint",
        },
        { label: "Screen", glint: "{screen}", theirs: "None. Stats live in the Google Health app.", lean: "even" },
        { label: "Record", glint: "{record}", theirs: "Google account and the Google Health app.", lean: "glint" },
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
        "The Amazfit Helio Strap is a screenless band at $99.99 once, with no subscription. Heart rate, sleep, and training load show up in the Zepp app. {name} is the same idea for less, and the record stays in your browser until you turn on backup.",
      rows: [
        { label: "Band", glint: "{bandPrice} once", theirs: "$99.99 once.", lean: "glint" },
        { label: "To keep it", glint: "{keep}", theirs: "No subscription. One payment.", lean: "even" },
        { label: "Screen", glint: "{screen}", theirs: "None. Stats live in the Zepp app.", lean: "even" },
        { label: "Record", glint: "{record}", theirs: "Zepp account.", lean: "glint" },
      ] satisfies CompareRow[],
      checked: "US price, checked October 2026.",
      sources: [{ label: "Amazfit · Helio Strap", href: "https://us.amazfit.com/products/helio-strap" }],
    },
    {
      slug: "polar-loop",
      name: "Polar Loop",
      intro:
        "Polar Loop is a screenless band at $199.99 once, with no subscription. {name} plans to cost less up front and does not add a membership to keep the band working.",
      rows: [
        { label: "Band", glint: "{bandPrice} once", theirs: "$199.99 once.", lean: "glint" },
        { label: "To keep it", glint: "{keep}", theirs: "No subscription. One payment.", lean: "even" },
        { label: "Screen", glint: "{screen}", theirs: "None. Stats live in Polar’s app.", lean: "even" },
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
        answer: [
          "The planned price is {bandPrice} once for the band. ",
          { href: "/pricing", label: "See pricing" },
          " for the full bill.",
        ],
      },
      {
        question: "Is there a subscription?",
        answer: ["No. Optional encrypted backup is {backupPrice} a year. The band keeps working if you skip it."],
      },
      {
        question: "Why is there no screen?",
        answer: [
          "So your wrist stays quiet. Heart rate, sleep, and movement land in your browser. You look when you want to.",
        ],
      },
      {
        question: "What does local first mean?",
        answer: [
          "Your data is stored in this browser. Nothing leaves this browser unless you turn on backup or export a file yourself.",
        ],
      },
      {
        question: "Where does my data live?",
        answer: [
          "In this browser. This browser encrypts a copy, then backup uploads ciphertext only. ",
          { href: "/privacy", label: "Privacy" },
          " has the longer version.",
        ],
      },
      {
        question: "What if I lose my recovery key?",
        answer: [
          "There is no account. If you cannot open the vault, the backup stays locked. A new payment does not unwrap old ciphertext.",
        ],
      },
      {
        question: "What happens to my backup if I stop paying?",
        // CONFIRM: pick the real retention period before launch.
        answer: [
          "The band keeps working. Uploads stop when the year ends. The locked copies stay locked. A new payment does not unwrap them.",
        ],
      },
      {
        question: "Do you sell my data?",
        answer: ["No. We do not sell your data. We also cannot read your backup."],
      },
      {
        question: "Can I export or delete my data?",
        answer: [
          "Export a plain CSV or JSON anytime. Wipe this browser from the ",
          { href: "/dashboard", label: "dashboard" },
          ". There is no account.",
        ],
      },
    ],
  },
  how: {
    heading: "How it works",
    lede: "The band stays on your wrist. The dashboard in this browser is free. Backup is the only optional payment.",
  },
  pricing: {
    title: "Pricing",
    description:
      "The dashboard is free. The band is {bandPrice} once. Backup is {backupPrice} a year, and it is optional.",
    kicker: "Hardware",
    product: "{name}",
    once: "once",
    lede: "You buy the band once. Reading it in the dashboard costs nothing. Backup is a separate year, and you can skip it.",
    dashboard: "Dashboard",
    free: "Free",
    dashboardBody: "Open your data in this browser. No account and no subscription.",
    band: "The band",
    bandBody: "Once, at the planned launch price. The band works with no subscription.",
    backup: "Backup",
    optional: "Optional",
    backupBody: "A year of encrypted backup. The band still works if you skip it.",
    unit: "usd",
    backupUnit: "usd / year",
    payBackup: "Add a year of backup,",
    checkoutOff: "Checkout is off until payments are configured.",
    gallery: "Product views",
    viewBox: "Packaging",
    viewSoon: "Coming soon",
  },
  privacy: {
    title: "Privacy",
    description: "What {name} stores, and how encrypted backup works.",
    blocks: [
      {
        p: "This website takes payment through Stripe. We store the email on the order, whether you bought the band, and the date backup is paid through. We do not collect heart rate, sleep, or activity here in readable form.",
      },
      { h: "On this browser" },
      {
        p: "{name} is local first. Samples stay in this browser. A new browser does not have that copy until you restore it.",
      },
      { h: "When backup is on" },
      {
        p: "This browser encrypts a copy, then backup uploads ciphertext only. We cannot read it, and another company cannot pull a readable copy from us.",
      },
      {
        p: "There is no account. A new payment does not unwrap old ciphertext.",
      },
      { h: "Exports" },
      {
        p: "You can export a plain CSV or JSON anytime. That export is not encrypted. Treat it like any other file you own. Sending it straight to Google Drive is coming soon.",
      },
      { h: "Deleting your data" },
      {
        p: "Wipe this browser and that copy is gone from it. The locked copies we hold stay locked. There is no account.",
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
        p: "Card numbers stay at Stripe. Checkout is Stripe's page. {name} stores the order email, whether you bought the band and backup, and the date backup is paid through.",
      },
      { h: "This website" },
      {
        p: "The production site is served over HTTPS. This website does not load third-party ads or analytics. {name} does not sell customer data.",
      },
      { h: "When you back up with {name}" },
      {
        p: "This browser encrypts a copy, then backup uploads ciphertext only. A database backup does not reveal readable samples.",
      },
      {
        p: "There is no account. A new payment does not unwrap old ciphertext.",
      },
      { h: "Known limits" },
      {
        p: "You are trusting this website to run the code we publish. If you cannot open the vault, that backup stays locked. A new payment does not unwrap old ciphertext.",
      },
      {
        p: "Stripe keeps the receipt. We still cannot read a backup.",
      },
      { p: ["The same rules are written in plain language on ", { href: "/privacy", label: "Privacy" }, "."] },
    ],
  },
  dashboard: {
    title: "Dashboard",
    description: "Open the {name} vault on this browser.",
    lede: "Samples stay on this browser until you choose backup.",
    opening: "Opening dashboard…",
    create: "Create a passkey",
    haveRecovery: "I already have a recovery key",
    saveWarning:
      "Save this recovery key now. There is no reset. If it is lost, and you cannot open the vault another way, the locked samples stay locked. A new payment does not open them.",
    copy: "Copy",
    saved: "I saved this key",
    continue: "Continue",
    unlock: "Unlock",
    pasteRecovery: "Paste recovery key",
    recoveryLabel: "Recovery key",
    recoveryBack: "Back",
    addPasskey: "Add a passkey for this device",
    skip: "Skip",
    connect: "Connect the band",
    connected: "Band connected",
    sample: "Sample",
    backup: "Backup",
    paidThrough: "Paid through",
    pay: "Pay for backup",
    payOff: "Backup checkout is not configured.",
    lock: "Lock",
    noPasskey: "Use the recovery key on this device.",
    failed: "That did not work.",
    backupFailed: "Could not sync backup.",
  },
  checkout: {
    successTitle: "Order received",
    // CONFIRM: add the real ship estimate once the hardware is final.
    successBody:
      "Stripe has the payment. We will email you when the band is ready to ship. If you bought a year of backup, we email you before it ends.",
    back: "Back to {name}",
    cancelTitle: "Checkout canceled",
    cancelBody: "No charge was made.",
  },
} as const;
