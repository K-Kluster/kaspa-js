import { KaspaAddress } from "@kluster/kaspa-address";

export function assertKaspaAddress(addr: string) {
  KaspaAddress.fromString(addr);
}

export function nowIso(): string {
  return new Date().toISOString();
}
