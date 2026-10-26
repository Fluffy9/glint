export function formatUsd(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** $69.99, or $10 when the cents are a whole dollar. */
export function formatUsdLabel(cents: number): string {
  const dollars = cents / 100;
  const body = Number.isInteger(dollars) ? String(dollars) : dollars.toFixed(2);
  return `$${body}`;
}
