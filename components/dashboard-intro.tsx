import { copy } from "@/content";

/** Title and lede are always the same, so the card is never blank before the vault flag resolves. */
export function DashboardIntro() {
  return (
    <>
      <h1 className="h1">{copy.dashboard.title}</h1>
      <p className="account-lede">{copy.dashboard.lede}</p>
    </>
  );
}
