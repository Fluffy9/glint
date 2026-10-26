import Link from "next/link";
import { copy, fill, type CopyVars } from "@/content";
import type { Competitor } from "@/lib/competitors";

export function CompetitorTable({
  competitor,
  heading,
  vars,
}: {
  competitor: Competitor;
  /** Homepage card titles the window. The crawlable page already has an h1. */
  heading?: "h2" | "h3";
  vars?: Partial<CopyVars>;
}) {
  const Title = heading;
  const filled = { ...vars, competitor: competitor.name };

  return (
    <div className="gl-win gl-win-elev3 compare-band-card">
      <div className="gl-win-bar">
        <span className="gl-win-title">{copy.compare.window}</span>
      </div>
      {Title ? <Title className="compare-card-title">{fill(copy.compare.cardTitle, filled)}</Title> : null}
      <div className="gl-win-body compare-body">
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col">
                <span className="gl-sr">Topic</span>
              </th>
              <th scope="col">{fill(copy.compare.column, filled)}</th>
              <th scope="col">{competitor.name}</th>
            </tr>
          </thead>
          <tbody>
            {competitor.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td data-lean={row.lean === "glint" ? "win" : undefined}>{fill(row.glint, filled)}</td>
                <td data-lean={row.lean === "glint" ? "skip" : undefined}>{fill(row.theirs, filled)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="compare-card-note">
        <p>
          {copy.compare.sources}{" "}
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
            <Link href={`/vs/${competitor.slug}`}>{fill(copy.compare.openPage, filled)}</Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
