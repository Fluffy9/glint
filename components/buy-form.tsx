import { copy } from "@/content";
import { formatUsd } from "@/lib/money";

export function BuyForm({
  enabled,
  backupCents,
  bandPaymentUrl,
  backupPaymentUrl,
}: {
  enabled: boolean;
  backupCents: number;
  bandPaymentUrl: string | null;
  backupPaymentUrl: string | null;
}) {
  return (
    <div className="buy-form">
      {enabled && bandPaymentUrl && backupPaymentUrl ? (
        <>
          <a className="gl-btn gl-btn-primary" href={bandPaymentUrl}>
            {copy.nav.getTheBand}
          </a>
          <a className="gl-btn" href={backupPaymentUrl}>
            {copy.pricing.payBackup} {formatUsd(backupCents)} usd
          </a>
        </>
      ) : (
        <>
          <button className="gl-btn gl-btn-primary" type="button" disabled>
            {copy.nav.getTheBand}
          </button>
          <p className="fine">{copy.pricing.checkoutOff}</p>
        </>
      )}
    </div>
  );
}
