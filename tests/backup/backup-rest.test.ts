import { describe, expect, it, vi } from "vitest";
import { downloadBackup, redeemBackup, uploadBackup } from "../../functions/src/domain/backup-rest";

describe("backup function client", () => {
  it("redeems a checkout and uploads ciphertext without an auth token", async () => {
    const fetchImpl = vi.fn(async (_url: string, _init?: RequestInit) =>
      Response.json({ paidUntil: "2027-01-01T00:00:00.000Z", stored: true }),
    );
    await redeemBackup(fetchImpl, "/redeemBackup", {
      sessionId: "cs_1",
      vaultId: "vault-a",
      capabilityHash: "hash",
    });
    await uploadBackup(fetchImpl, "/uploadBackup", {
      vaultId: "vault-a",
      capability: "secret",
      objectId: "obj_1",
      category: "header",
      nonce: "n",
      keyVersion: 1,
      ciphertextBase64: "YQ==",
    });
    const bodies = fetchImpl.mock.calls.map((call) => JSON.parse(String(call[1]?.body)));
    expect(bodies[0]).toEqual({ sessionId: "cs_1", vaultId: "vault-a", capabilityHash: "hash" });
    expect(bodies[1]).toMatchObject({ capability: "secret", vaultId: "vault-a" });
    expect(JSON.stringify(bodies)).not.toContain("idToken");
    expect(JSON.stringify(fetchImpl.mock.calls)).not.toContain("authorization");
  });

  it("downloads ciphertext for a vault id", async () => {
    const fetchImpl = vi.fn(async (_url: string, _init?: RequestInit) =>
      Response.json({
        objects: [{ objectId: "obj_1", category: "header", nonce: "n", keyVersion: 1, ciphertextBase64: "YQ==" }],
      }),
    );
    const result = await downloadBackup(fetchImpl, "/downloadBackup", "vault-a");
    expect(result.objects).toHaveLength(1);
    expect(JSON.parse(String(fetchImpl.mock.calls[0]?.[1]?.body))).toEqual({ vaultId: "vault-a" });
  });
});
