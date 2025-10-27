const CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const CHECKSUM_LENGTH = 8;

const CHARSET_MAP: Record<string, number> = {};
// @ts-ignore
for (let i = 0; i < CHARSET.length; i++) CHARSET_MAP[CHARSET[i]] = i;

const GENERATOR = [
  0x98f2bc8e61n,
  0x79b76d99e2n,
  0xf33e5fb3c4n,
  0xae2eabe2a8n,
  0x1e4f43e470n,
] as const;

function prefixToUint5Array(prefix: string): number[] {
  const arr = new Array(prefix.length);
  for (let i = 0; i < prefix.length; i++) arr[i] = prefix.charCodeAt(i) & 31;
  return arr;
}

function ints(bytes: ArrayLike<number>): number[] {
  const out = new Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) out[i] = bytes[i] as number;
  return out;
}

function polyMod(values: number[]): bigint {
  let checksum = 1n;
  for (const value of values) {
    const v = BigInt(value);
    const topBits = checksum >> 35n;
    checksum = ((checksum & 0x07ffffffffn) << 5n) ^ v;
    for (let i = 0; i < GENERATOR.length; i++) {
      if (((topBits >> BigInt(i)) & 1n) === 1n) {
        // @ts-ignore
        checksum ^= GENERATOR[i];
      }
    }
  }
  return checksum ^ 1n;
}

function calculateChecksum(
  prefix: string,
  payload5: ArrayLike<number>,
): Uint8Array {
  const prefixLower5 = prefixToUint5Array(prefix);
  const payloadInts = ints(payload5);
  const zeros = [0, ...new Array(CHECKSUM_LENGTH).fill(0)];
  const concat = [
    ...prefixLower5,
    ...zeros.slice(0, 1),
    ...payloadInts,
    ...zeros.slice(1),
  ];
  // polyMod over (prefix5 + 0 + payload5 + 8 zero-words)
  const pm = polyMod(concat);
  const res = new Uint8Array(CHECKSUM_LENGTH);
  for (let i = 0; i < CHECKSUM_LENGTH; i++) {
    // big-endian 5-bit chunks
    res[i] = Number((pm >> BigInt(5 * (CHECKSUM_LENGTH - 1 - i))) & 31n);
  }
  return res;
}

function verifyChecksum(prefix: string, payload5: ArrayLike<number>): boolean {
  const prefixLower5 = prefixToUint5Array(prefix);
  const payloadInts = ints(payload5);
  const dataToVerify = [...prefixLower5, 0, ...payloadInts];
  return polyMod(dataToVerify) === 0n;
}

// ----- Base32 (Kaspa alphabet) -----
function decodeFromBase32(s: string): Uint8Array {
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    // @ts-ignore
    const idx = CHARSET_MAP[c];
    if (idx === undefined)
      throw new Error(`invalid character not part of charset: ${c}`);
    out[i] = idx;
  }
  return out;
}

function encodeToBase32(data5: ArrayLike<number>): string {
  let out = "";
  for (let i = 0; i < data5.length; i++) {
    const v = data5[i] as number;
    if (v < 0 || v >= CHARSET.length) return ""; // match Go's legacy behavior
    out += CHARSET[v];
  }
  return out;
}

// Bit regrouping (lenient; no padding error checks)
type ConversionType = { fromBits: number; toBits: number; pad: boolean };
const fiveToEightBits: ConversionType = { fromBits: 5, toBits: 8, pad: false };
const eightToFiveBits: ConversionType = { fromBits: 8, toBits: 5, pad: true };

function convertBits(
  data: Uint8Array,
  { fromBits, toBits, pad }: ConversionType,
): Uint8Array {
  const regrouped: number[] = [];
  let nextByte = 0;
  let filledBits = 0;

  for (let b of data) {
    // discard unused high bits, keep only fromBits LSBs
    b = (b << (8 - fromBits)) & 0xff;

    let remainingFrom = fromBits;
    while (remainingFrom > 0) {
      const remainingTo = toBits - filledBits;
      const toExtract =
        remainingFrom < remainingTo ? remainingFrom : remainingTo;

      nextByte = ((nextByte << toExtract) | (b >> (8 - toExtract))) & 0xff;
      b = (b << toExtract) & 0xff;

      remainingFrom -= toExtract;
      filledBits += toExtract;

      if (filledBits === toBits) {
        regrouped.push(nextByte);
        nextByte = 0;
        filledBits = 0;
      }
    }
  }

  if (pad && filledBits > 0) {
    nextByte = (nextByte << (toBits - filledBits)) & 0xff;
    regrouped.push(nextByte);
    nextByte = 0;
    filledBits = 0;
  }

  return new Uint8Array(regrouped);
}

// Encode: prefix + ':' + base32(data5 + checksum5)
// data5 is [version(5bit)] + payload(5bit-packed)
export function encodeKaspa(
  prefix: string,
  payload: Uint8Array,
  version: number,
): string {
  const data = new Uint8Array(1 + payload.length);
  data[0] = version & 0xff;
  data.set(payload, 1);

  // 8 -> 5 with padding
  const converted = convertBits(data, eightToFiveBits);

  if (prefix.length + 1 + converted.length + CHECKSUM_LENGTH > 90) {
    throw new Error("Exceeds length limit");
  }
  for (let i = 0; i < prefix.length; i++) {
    const c = prefix.charCodeAt(i);
    if (c < 33 || c > 126) throw new Error(`Invalid prefix (${prefix})`);
  }
  prefix = prefix.toLowerCase();

  const checksum = calculateChecksum(prefix, converted);
  const combined = new Uint8Array(converted.length + checksum.length);
  combined.set(converted);
  combined.set(checksum, converted.length);

  const base32 = encodeToBase32(combined);
  return `${prefix}:${base32}`;
}

export interface DecodedKaspa {
  prefix: string;
  version: number; // 0 | 1
  payload: Uint8Array; // 32 or 33 bytes if version is 1
}

// Decode returns canonical (lowercased) prefix, payload bytes, and version byte.
export function decodeKaspa(encoded: string): DecodedKaspa {
  if (encoded.length < CHECKSUM_LENGTH + 2) {
    throw new Error(`invalid bech32 string length ${encoded.length}`);
  }
  for (let i = 0; i < encoded.length; i++) {
    const c = encoded.charCodeAt(i);
    if (c < 33 || c > 126)
      throw new Error(`invalid character in string: '${encoded[i]}'`);
  }

  const lower = encoded.toLowerCase();
  const upper = encoded.toUpperCase();
  if (encoded !== lower && encoded !== upper) {
    throw new Error("string not all lowercase or all uppercase");
  }
  encoded = lower;

  const colon = encoded.lastIndexOf(":");
  if (colon < 1 || colon + CHECKSUM_LENGTH + 1 > encoded.length) {
    throw new Error("invalid index of ':'");
  }

  const prefix = encoded.slice(0, colon);
  const dataPart = encoded.slice(colon + 1);
  if (dataPart.length < CHECKSUM_LENGTH) throw new Error("data too short");

  const decoded5 = decodeFromBase32(dataPart);

  if (!verifyChecksum(prefix, decoded5)) {
    const checksum = encoded.slice(encoded.length - CHECKSUM_LENGTH);
    const expected = encodeToBase32(
      calculateChecksum(
        prefix,
        decoded5.slice(0, decoded5.length - CHECKSUM_LENGTH),
      ),
    );
    throw new Error(`checksum failed. Expected ${expected}, got ${checksum}`);
  }

  // strip checksum tail
  const words5 = decoded5.slice(0, decoded5.length - CHECKSUM_LENGTH);

  // 5 -> 8 (no error on padding, like Go)
  const converted = convertBits(words5, fiveToEightBits);
  if (converted.length < 1) throw new Error("Missing version/data");

  const version = converted[0]!;
  const payload = converted.slice(1);

  return { prefix, version, payload };
}
