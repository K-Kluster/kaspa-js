import {
  getPersonalMessageUint8ArrayFromString,
  verifySignatureFromDigest,
} from "@kluster/kaspa-signature";
import { VerificationError } from "./errors";
import { buildMessage } from "./message";
import type { SiwkFields, VerifyOptions, VerifyResult } from "./types";
import { assertKaspaAddress } from "./utils";
import { KaspaAddress } from "@kluster/kaspa-address";

export async function verifyMessage(
  message: string,
  kaspaAddress: string,
  signature: string,
): Promise<void> {
  assertKaspaAddress(kaspaAddress);

  const digest = getPersonalMessageUint8ArrayFromString(message);

  const ok = await verifySignatureFromDigest(
    digest,
    signature,
    KaspaAddress.fromString(kaspaAddress),
  );
  if (!ok) {
    throw new VerificationError("signature/address mismatch");
  }
}

export async function verifySiwk(
  fields: SiwkFields,
  signature: string,
  opts: VerifyOptions = {},
): Promise<VerifyResult> {
  try {
    if (opts.domain && fields.domain !== opts.domain) {
      throw new VerificationError("domain mismatch");
    }

    assertKaspaAddress(fields.address);

    const at = opts.atTime ?? new Date();
    const skew = opts.clockSkewMs ?? 5 * 60 * 1000;

    const issued = Date.parse(fields.issuedAt);
    if (Number.isNaN(issued)) throw new VerificationError("invalid issuedAt");
    if (issued - at.getTime() > skew)
      throw new VerificationError("issuedAt is in the future");

    if (fields.notBefore) {
      const nb = Date.parse(fields.notBefore);
      if (Number.isNaN(nb)) throw new VerificationError("invalid notBefore");
      if (at.getTime() + skew < nb)
        throw new VerificationError("notBefore not reached");
    }

    if (fields.expirationTime) {
      const exp = Date.parse(fields.expirationTime);
      if (Number.isNaN(exp))
        throw new VerificationError("invalid expirationTime");
      if (at.getTime() - skew > exp)
        throw new VerificationError("message expired");
    }

    if (opts.checkNonce) {
      const ok = await opts.checkNonce(fields.nonce);
      if (!ok) throw new VerificationError("nonce rejected");
    }

    const built = buildMessage(fields);

    // Verify against claimed address; if the helper doesn't accept address, recover and compare.
    const ok = await verifySignatureFromDigest(
      built.digest,
      signature,
      KaspaAddress.fromString(fields.address),
    );
    if (!ok) {
      throw new VerificationError("signature/address mismatch");
    }

    return { valid: true };
  } catch (e) {
    if (e instanceof VerificationError) {
      return {
        valid: false,
        reason: e.reason,
      };
    }

    if (e instanceof Error) {
      return {
        valid: false,
        reason: e.message,
      };
    }

    return {
      valid: false,
      reason: "unexpected error",
    };
  }
}
