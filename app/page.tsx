import Link from "next/link";
import { ProgressSample } from "@/components/progress-sample";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const promises = [
  {
    title: "No screen",
    body: "Nothing on your wrist to check in the middle of a run. The band keeps the record. You look when you want to.",
  },
  {
    title: "No monthly fee",
    body: "The band is $69.99 once. It keeps working if you never pay again. Backup is a separate $10 a year, and you can skip it.",
  },
  {
    title: "No feed",
    body: "A slower week is information. There is no scoreboard and no one to perform for.",
  },
];

export default function Home() {
  return (
    <div className="site">
      <SiteHeader />
      <section className="hero">
        <div className="hero-copy gl-win">
          <div className="gl-win-bar">
            <span className="gl-win-title">Glint</span>
          </div>
          <div className="gl-win-body">
            <h1 className="h1">A band with no screen.</h1>
            <p className="lede">
              You wear it. Heart rate, sleep, and movement stay on the phone
              until you decide a copy should leave.
            </p>
            <div className="hero-actions">
              <Link className="gl-btn gl-btn-primary" href="#band">
                [ Get the band ]
              </Link>
              <p className="price-note">$69.99 once</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="promises">
        <h2 id="promises" className="h2">
          The offer
        </h2>
        <div className="promise-grid">
          {promises.map((promise) => (
            <article key={promise.title} className="gl-win">
              <div className="gl-win-bar">
                <span className="gl-win-title">{promise.title}</span>
              </div>
              <div className="gl-win-body">
                <p style={{ margin: 0 }}>{promise.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="sample">
        <h2 id="sample" className="h2">
          One glance
        </h2>
        <div className="gl-win">
          <div className="gl-win-bar">
            <span className="gl-win-title">Today, a sample</span>
          </div>
          <div className="gl-win-body preview">
            <ProgressSample />
            <div className="stat-grid">
              <div className="gl-stat">
                <span className="gl-stat-label">Heart rate</span>
                <span className="gl-stat-value">
                  58<span className="gl-stat-unit">bpm</span>
                </span>
                <span className="gl-stat-delta is-down">3 lower than last week</span>
              </div>
              <div className="gl-stat">
                <span className="gl-stat-label">Sleep</span>
                <span className="gl-stat-value">
                  7.4<span className="gl-stat-unit">h</span>
                </span>
              </div>
              <div className="gl-stat">
                <span className="gl-stat-label">Steps</span>
                <span className="gl-stat-value">
                  8420
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className="fine">
          These figures are a picture of the app, not your data. The colour of
          the page follows the band you pick above.
        </p>
      </section>

      <section className="section" id="band" aria-labelledby="prices">
        <h2 id="prices" className="h2">
          What you pay
        </h2>
        <div className="price-grid">
          <article className="gl-win gl-win-accent">
            <div className="gl-win-bar">
              <span className="gl-win-title">The band</span>
            </div>
            <div className="gl-win-body">
              <p className="gl-stat-value" style={{ margin: 0 }}>
                69.99<span className="gl-stat-unit">usd</span>
              </p>
              <p>Once. The band works with no subscription.</p>
              <Link className="gl-btn gl-btn-primary" href="#band">
                [ Get the band ]
              </Link>
            </div>
          </article>
          <article className="gl-win">
            <div className="gl-win-bar">
              <span className="gl-win-title">Backup</span>
            </div>
            <div className="gl-win-body">
              <p className="gl-stat-value" style={{ margin: 0 }}>
                10<span className="gl-stat-unit">usd / year</span>
              </p>
              <p>
                Optional. You choose what leaves the phone. Cancel backup and
                the band still works.{" "}
                <Link href="/privacy">How that choice works.</Link>
              </p>
            </div>
          </article>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
