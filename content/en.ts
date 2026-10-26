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
    description: "{name} is a screenless fitness band that keeps your data on your phone first.",
  },
  nav: {
    site: "Site",
    pricing: "Pricing",
    privacy: "Privacy",
    security: "Security",
    signIn: "Sign in",
    account: "Account",
    signOut: "Sign out",
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
    lede: "You wear it. Heart rate, sleep, and movement live on your phone first, and only leave if you choose to back them up.",
    priceNote: "planned {amount} usd once",
  },
  features: {
    heading: "Fitness tracking that just works",
    lede: "You buy the band once, keep the data, and skip the subscription theatre.",
    items: [
      {
        id: "no-bs",
        title: "No BS",
        body: "Plain language about what the band stores and what leaves your phone. No ads, no streaks nagging you.",
      },
      {
        id: "screenless",
        title: "No screen",
        body: "Nothing on your wrist to check mid-run. You look at your phone when you want to.",
      },
      {
        id: "offline",
        title: "Local first",
        body: "Your data lives on your phone and works without a connection. Backup is optional, and you can skip it.",
      },
      {
        id: "battery",
        title: "Battery",
        body: "No screen to power. We will publish the measured battery life here once the band is final.",
      },
      {
        id: "lock",
        title: "Encrypted backup",
        body: "Backups are locked with a key made from your password before they leave your phone. We keep ciphertext only.",
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
        body: "Delete the account and we delete the backup copies we hold.",
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
    glintScreen: "None. You read it on your phone.",
    glintBattery: "To be announced.",
    glintRecord: "On your phone first. A copy leaves only if you turn on backup. No feed.",
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
        "The Amazfit Helio Strap is a screenless band at $99.99 once, with no subscription. Heart rate, sleep, and training load show up in the Zepp app. {name} is the same idea for less, and the record stays on your phone until you turn on backup.",
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
          "So your wrist stays quiet. Heart rate, sleep, and movement land on your phone. You look when you want to.",
        ],
      },
      {
        question: "What does local first mean?",
        answer: [
          "Your data is stored on your phone and the app works without a connection. Nothing leaves the phone unless you turn on backup or export a file yourself.",
        ],
      },
      {
        question: "Where does my data live?",
        answer: [
          "On your phone. If you turn on backup, a copy is locked with a key made from your password before it leaves the phone, and we store ciphertext only. ",
          { href: "/privacy", label: "Privacy" },
          " has the longer version.",
        ],
      },
      {
        question: "What if I forget my password?",
        answer: [
          "If you forget the password, the backup stays locked. We cannot unlock it. If you find the password, enter it and the backup opens again. Your phone copy is not affected, and you can export a plain copy first.",
        ],
      },
      {
        question: "What happens to my backup if I stop paying?",
        // CONFIRM: pick the real retention period before launch.
        answer: [
          "The band keeps working. We keep your backup for 30 days after it ends so you can export it, then we delete it.",
        ],
      },
      {
        question: "Do you sell my data?",
        answer: ["No. We do not sell your data. We also cannot read your backup."],
      },
      {
        question: "Can I export or delete my data?",
        answer: [
          "Export a plain CSV or JSON anytime. Signed in, you can delete the account and the backup copies we hold from the ",
          { href: "/account", label: "account page" },
          ".",
        ],
      },
    ],
  },
  pricing: {
    title: "Pricing",
    description: "The planned price is {bandPrice} once for the band. Backup is {backupPrice} a year, and it is optional.",
    heading: "What you pay",
    band: "The band",
    bandBody: "Once, at the planned launch price. The band works with no subscription.",
    backup: "Backup",
    unit: "usd",
    backupUnit: "usd / year",
    payBackup: "Add a year of backup,",
    checkoutOff: "Checkout is off until payments are configured.",
    backupBody: [
      "Optional. One payment covers a year. We email you before it ends. Backup is locked with your password before it leaves your phone. The band still works if you skip it. ",
      { href: "/privacy", label: "How encryption works." },
    ],
  },
  privacy: {
    title: "Privacy",
    description: "What {name} stores, and how encrypted backup works.",
    blocks: [
      {
        p: "This website takes payment through Stripe. We store the email on the order, whether you bought the band, and the date backup is paid through. We do not collect heart rate, sleep, or activity here in readable form.",
      },
      { h: "On the phone" },
      {
        p: "{name} is local first. Tracking starts on your phone and works without a connection. A new phone does not have that copy until you restore it from backup or from an export.",
      },
      { h: "When backup is on" },
      {
        p: "Backup is encrypted on your phone before it leaves. The key is made from your password. We store ciphertext only. We cannot read it, and another company cannot pull a readable copy from us.",
      },
      {
        // CONFIRM: only keep the browser sentence if decryption really happens client-side
        // and the password never reaches the server.
        p: "To show charts on the website, your browser decrypts the copy with your password. The password stays in your browser and is not sent to us.",
      },
      { h: "If you reset your password" },
      {
        p: "You can reset your password and keep using {name}. Backups made with the old password stay locked. We cannot unlock them. If you find the old password, entering it opens them again. Your phone copy is not affected, and a plain export always works. Before you reset, export a plain copy if you want a way back.",
      },
      { h: "Exports" },
      {
        p: "You can export a plain CSV or JSON anytime. That export is not encrypted. Treat it like any other file you own. Sending it straight to Google Drive is coming soon.",
      },
      { h: "Other apps" },
      { p: "An app on your phone can receive a category from the phone. The phone already has the samples." },
      { h: "Deleting your data" },
      {
        p: "Turning a category off stops it from being backed up. Delete the account on the site and we delete the backup copies we hold. The phone copy stays on the phone until you delete it there.",
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
        p: "Backup is encrypted on your phone before it is uploaded, with a key made from your password. We store ciphertext only. A database backup does not reveal readable samples.",
      },
      {
        // CONFIRM: same condition as the Privacy page.
        p: "Decryption for the website happens in your browser, and your password is not sent to us.",
      },
      { h: "Known limits" },
      {
        p: "You are trusting the app and this website to run the code we publish. We cannot unlock a backup for you, which also means that if the password is lost and there is no phone copy or export, that backup is gone. Resetting your password does not unlock old backups.",
      },
      {
        p: "Delete the account while signed in and we delete the backup copies we hold, then the sign-in. Stripe keeps the receipt. We still cannot read a backup.",
      },
      { p: ["The same rules are written in plain language on ", { href: "/privacy", label: "Privacy" }, "."] },
    ],
  },
  login: {
    title: "Sign in",
    description: "Sign in to a {name} account.",
    body: "An account is where a backup lives after you choose to send a copy off the phone. We email you a sign-in link. There is no password for the account itself.",
    pricing: "See pricing",
  },
  account: {
    title: "Account",
    description: "Sign in with an email link to manage backup.",
    emailLabel: "Email",
    sendLink: "Email me a sign-in link",
    sent: "Check your email for the sign-in link.",
    notConfigured: "Sign-in is not configured on this site yet.",
    emulatorNote: "This browser is talking to the local emulators. No email is sent.",
    openLink: "Open the sign-in link",
    checking: "Checking sign-in…",
    statusLabel: "Status",
    signedIn: "Signed in as {email}",
    backupNone: "No backup uploaded yet",
    backupReady: "Ready for a test backup",
    backupSaved: "Locked test backup on file",
    testTitle: "Test backup",
    testBody:
      "Encrypt the sample text with a passphrase and upload the ciphertext. Then unlock it locally to prove the round trip.",
    sampleLabel: "Sample text",
    passphrase: "Backup passphrase",
    saveBackup: "Save a test backup",
    blobLockedLabel: "Encrypted upload",
    blobUnlockedLabel: "Unlocked locally",
    unlockPassphrase: "Passphrase",
    unlockBackup: "Unlock locally",
    unlockedTitle: "Unlocked locally",
    unlockedBody: "This browser decrypted the downloaded ciphertext. The server never saw the passphrase.",
    unlockFailed: "Could not unlock that backup. Check the passphrase.",
    saveAnother: "Save another test backup",
    deleteTitle: "Delete account",
    deleteBody:
      "This deletes the backup copies we hold and the sign-in. It does not delete the Stripe receipt. Your phone copy stays on the phone.",
    confirmLabel: "Type DELETE to confirm",
    deleteButton: "Delete account",
    deleted: "The account is deleted.",
    failed: "That did not work. Try the sign-in link again.",
    sendFailed: "Could not send a sign-in link. Check that the local emulators are running.",
    backupFailed: "Could not save the backup.",
    backupFailedEmulator:
      "Could not save the backup. Check that the local emulators are running (storage on 9199).",
    deleteFailed: "Could not delete the account.",
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
