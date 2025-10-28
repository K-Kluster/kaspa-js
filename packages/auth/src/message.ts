import { getPersonalMessageUint8ArrayFromString } from "@kluster/kaspa-signature";
import { canonicalSiwkString } from "./canonical";
import type { SiwkFields, BuiltMessage } from "./types";
import { assertKaspaAddress } from "./utils";

export function buildMessage(fields: SiwkFields): BuiltMessage {
  if (fields.version !== "1") throw new Error('version must be "1"');
  assertKaspaAddress(fields.address);

  const message = canonicalSiwkString(fields);
  const digest = getPersonalMessageUint8ArrayFromString(message);

  return { message, prefixed: new TextEncoder().encode(message), digest };
}
