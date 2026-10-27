export const VAULT_FLAG = "glint-vault";
export const VAULT_FLAG_EVENT = "glint-vault";

export function readVaultFlag(storage: Pick<Storage, "getItem">): boolean {
  return storage.getItem(VAULT_FLAG) === "1";
}

export function writeVaultFlag(storage: Pick<Storage, "setItem" | "removeItem">, present: boolean): void {
  if (present) storage.setItem(VAULT_FLAG, "1");
  else storage.removeItem(VAULT_FLAG);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(VAULT_FLAG_EVENT));
}
