import Link from "next/link";
import type { Competitor } from "@/lib/competitors";

export function CompetitorTable({
  competitor,
  heading,
}: {
  competitor: Competitor;
  /** Homepage card titles the window. The crawlable page already has an h1. */
  heading?: "h2" | "h3";
}) {
  const Title = heading;

  return (
    <div className="gl-win gl-win-elev3 compare-band-card">
      <div className="gl-win-bar">
        <span className="gl-win-title">Side by side</span>
      </div>
      <div className="gl-win-body compare-body">
        {Title ? <Title className="compare-card-title">Glint vs {competitor.name}</Title> : null}
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col"> </th>
              <th scope="col">Glint</th>
              <th scope="col">{competitor.name}</th>
            </tr>
          </thead>
          <tbody>
            {competitor.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td data-lean={row.lean === "glint" ? "win" : undefined}>{row.glint}</td>
                <td data-lean={row.lean === "glint" ? "skip" : undefined}>{row.theirs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="compare-card-note">
        <p>
          Sources:{" "}
          {competitor.sources.map((source, index) => (
            <span key={source.href}>
              {index > 0 ? ", " : null}
              <a href={source.href} rel="noopener noreferrer" target="_blank">
                {source.label}
              </a>
            </span>
          ))}
          . {competitor.checked}
        </p>
        {heading ? (
          <p>
            <Link href={`/vs/${competitor.slug}`}>Open the {competitor.name} page.</Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
