import Link from "next/link";
import type { ReactNode } from "react";

type FaqItem = {
  question: string;
  answer: ReactNode;
};

const faqs: FaqItem[] = [
  {
    question: "How much does Glint cost?",
    answer: (
      <>
        The band is $69.99 once.{" "}
        <Link href="/pricing">See pricing</Link> for the full bill.
      </>
    ),
  },
  {
    question: "Is there a subscription?",
    answer:
      "No. Optional encrypted backup is $10 a year. The band keeps working if you skip it.",
  },
  {
    question: "Why is there no screen?",
    answer:
      "So your wrist stays quiet. Heart rate, sleep, and movement land on your phone. You look when you want to.",
  },
  {
    question: "Where does my data live?",
    answer: (
      <>
        On your phone by default. If you turn on backup, a scrambled copy leaves
        the phone. We store ciphertext only. The site unlocks it with your
        password when you want to look. <Link href="/privacy">Privacy</Link> has
        the longer version.
      </>
    ),
  },
  {
    question: "What if I forget my password?",
    answer:
      "Then the backup stays locked. We cannot reset it into something we can read. Keep the band’s copy on your phone, or export a plain copy to Google Drive or a file before you lose the password.",
  },
  {
    question: "Do you sell my data?",
    answer: "No. We do not sell your data. We also cannot read your backup.",
  },
  {
    question: "Can I export or delete my data?",
    answer:
      "Yes. Export a CSV or JSON anytime, including a plain copy to Google Drive if you want one you can open without Glint. Turn a category off and that copy is gone. Delete the account and so are we.",
  },
];

export function FaqSection() {
  return (
    <section className="section" aria-labelledby="faq">
      <h2 id="faq" className="h2">
        Questions
      </h2>
      <p className="section-lede">
        Short answers. Open one if you want the rest of the sentence.
      </p>

      <div className="faq-list">
        {faqs.map((item) => (
          <details key={item.question} className="faq-item">
            <summary className="faq-question">{item.question}</summary>
            <div className="faq-answer">{item.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
