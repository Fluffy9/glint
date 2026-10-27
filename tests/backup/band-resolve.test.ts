import { describe, expect, it } from "vitest";
import { FIXTURE_BAND_PLAINTEXT, resolveBandSource } from "../../lib/band";
import { mintDevVault, readFixtureBandFlag, writeFixtureBandFlag } from "../../lib/dashboard-dev";

describe("resolveBandSource", () => {
  it("returns fixture bytes when the fixture is on", async () => {
    const source = resolveBandSource({ serviceId: null, useFixture: true });
    await source.connect();
    expect(new TextDecoder().decode(await source.read())).toBe(FIXTURE_BAND_PLAINTEXT);
  });

  it("still requires a service id when the fixture is off", async () => {
    const source = resolveBandSource({ serviceId: null, useFixture: false });
    await expect(source.connect()).rejects.toThrow("not published");
  });
});

describe("fixture band flag", () => {
  it("defaults to on for local testing", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    };
    expect(readFixtureBandFlag(storage)).toBe(true);
    writeFixtureBandFlag(storage, false);
    expect(readFixtureBandFlag(storage)).toBe(false);
  });
});

describe("mintDevVault", () => {
  it("opens without a passkey wrap so Lock asks for recovery", async () => {
    const minted = await mintDevVault();
    expect(minted.record.passkeys).toEqual([]);
    expect(minted.recoveryKey.length).toBeGreaterThan(20);
  });
});
