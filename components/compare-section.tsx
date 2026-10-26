const rows = [
  {
    label: "Price",
    glint: "$69.99 once",
    others: "Device plus a year of fees",
    lean: "glint" as const,
  },
  {
    label: "Subscription",
    glint: "None",
    others: "Required to keep the good parts",
    lean: "glint" as const,
  },
  {
    label: "Privacy",
    glint: "On the phone until you send a copy",
    others: "Cloud by default",
    lean: "glint" as const,
  },
  {
    label: "Export",
    glint: "Anytime, anywhere",
    others: "When the portal allows it",
    lean: "glint" as const,
  },
  {
    label: "Social",
    glint: "None. No feed, no circles",
    others: "Teams, streaks, leaderboards",
    lean: "others" as const,
  },
  {
    label: "Peer stats",
    glint: "Your history only",
    others: "Crowd-trained norms and percentiles",
    lean: "others" as const,
  },
];

export function CompareSection() {
  return (
    <section className="section" aria-labelledby="compare">
      <h2 id="compare" className="h2">
        Glint vs the usual stack
      </h2>
      <p className="section-lede">
        Against Whoop, Fitbit, and the rest: the same record, without the
        subscription theatre.
      </p>

      <div className="gl-win">
        <div className="gl-win-bar">
          <span className="gl-win-title">Side by side</span>
        </div>
        <div className="gl-win-body compare-body">
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col">
                  <span className="gl-sr">Topic</span>
                </th>
                <th scope="col">Glint</th>
                <th scope="col">Whoop, Fitbit, etc.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td data-lean={row.lean === "glint" ? "win" : "skip"}>
                    {row.glint}
                  </td>
                  <td data-lean={row.lean === "others" ? "win" : "skip"}>
                    {row.others}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="fine">
        If you want a coach feed or a score against strangers, this is not that
        band. Glint keeps the record. You look when you want to.
      </p>
    </section>
  );
}
