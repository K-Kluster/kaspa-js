export type ISO8601 = string;

export interface SiwkFields {
  domain: string;
  address: string;
  statement?: string;
  uri: string;
  version: "1";
  chainId: string | number;
  nonce: string;
  issuedAt: ISO8601;
  expirationTime?: ISO8601;
  notBefore?: ISO8601;
  requestId?: string;
  resources?: string[];
}

export interface BuiltMessage {
  /** Canonical human-readable text */
  message: string;
  /** Prefixed bytes (API compatibility) */
  prefixed: Uint8Array;
  /** Double-SHA256 of prefixed bytes */
  digest: Uint8Array;
}

export interface SignatureLike {
  /** Hex */
  signature: string;
}

export interface VerifyOptions {
  /** Require domain === expectedDomain */
  domain?: string;
  /** Reject if now >= expirationTime */
  atTime?: Date;
  /** Custom nonce validator  */
  checkNonce?: (nonce: string) => Promise<boolean> | boolean;
  /** Allow a small clock skew in ms (default 5 min) */
  clockSkewMs?: number;
}

export interface VerifyResult {
  valid: boolean;
  reason?: string;
}
