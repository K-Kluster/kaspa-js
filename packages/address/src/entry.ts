import { decodeKaspa, encodeKaspa } from "./bech32.js";

export enum KaspaAddressVersion {
  SCHNORR = 0,
  ECDSA = 1,
}

export enum KaspaPrefix {
  MAINNET = "kaspa",
  TESTNET = "kaspatest",
  DEVNET = "kaspadev",
  SIMNET = "kaspasim",
}

const prefixValues = Object.values(KaspaPrefix);

export function getPrefixFromPrefixString(prefix: string): KaspaPrefix | null {
  for (const allowedPrefix of prefixValues) {
    if (prefix === allowedPrefix) {
      return allowedPrefix;
    }
  }
  return null;
}

export class KaspaAddress {
  private constructor(
    public readonly prefix: KaspaPrefix,
    public readonly version: KaspaAddressVersion,
    public readonly payload: Uint8Array,
  ) {}

  static fromString(address: string): KaspaAddress {
    const decoded = decodeKaspa(address);

    // prefix check
    const prefix = getPrefixFromPrefixString(decoded.prefix);
    if (!prefix) {
      throw new Error("Address does not start with one of the wanted prefix.");
    }

    // version
    const version = decoded.version;

    if (version !== 0 && version !== 1) {
      throw new Error("Payload version is invalid, expected 0 or 1.");
    }

    return new KaspaAddress(prefix, version, decoded.payload);
  }

  toString(): string {
    return encodeKaspa(this.prefix, this.payload, this.version);
  }
}
