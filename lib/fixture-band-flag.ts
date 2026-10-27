export const DEV_FIXTURE_BAND_FLAG = "glint-dev-fixture-band";

export function readFixtureBandFlag(storage: Pick<Storage, "getItem">): boolean {
  const value = storage.getItem(DEV_FIXTURE_BAND_FLAG);
  if (value === null) return true;
  return value === "1";
}

export function writeFixtureBandFlag(storage: Pick<Storage, "setItem">, on: boolean): void {
  storage.setItem(DEV_FIXTURE_BAND_FLAG, on ? "1" : "0");
}
