import { blake2b } from "@noble/hashes/blake2.js";
import { schnorr } from "@noble/secp256k1";
import { KaspaAddress, KaspaAddressVersion } from "@kaspa-auth/address";

const personalKey = new TextEncoder().encode("PersonalMessageSigningHash");

export function getSchnorrPublicKeyFromKaspaAddress(
  kaspaAddress: KaspaAddress,
) {
  if (kaspaAddress.version !== KaspaAddressVersion.SCHNORR) {
    throw new Error(
      "Trying to get a schnorr public key from an ECDSA Kaspa address.",
    );
  }

  return kaspaAddress.payload;
}

export function getPersonalMessageUint8ArrayFromString(
  msg: string,
): Uint8Array {
  return blake2b(new TextEncoder().encode(msg), {
    key: personalKey,
    dkLen: 32,
  });
}

export async function verifySignature(
  message: string,
  signatureHex: string,
  kaspaAddress: KaspaAddress,
) {
  return verifySignatureFromDigest(
    getPersonalMessageUint8ArrayFromString(message),
    signatureHex,
    kaspaAddress,
  );
}

export async function verifySignatureFromDigest(
  messageDigest: Uint8Array,
  signatureHex: string,
  kaspaAddress: KaspaAddress,
) {
  const sigRegex = signatureHex.match(/.{1,2}/g);

  if (sigRegex === null) {
    throw new Error("Signature is not in hexadecimal form");
  }

  const sigBytes = Uint8Array.from(sigRegex.map((byte) => parseInt(byte, 16)));

  return schnorr.verifyAsync(
    sigBytes,
    messageDigest,
    getSchnorrPublicKeyFromKaspaAddress(kaspaAddress),
  );
}
