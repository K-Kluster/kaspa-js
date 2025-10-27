import { describe, it, expect } from "@jest/globals";
import { verifySignature } from "./entry.js";
import { KaspaAddress } from "@kaspa-auth/address";

describe("verify schnorr", () => {
  const message = "hello world";
  const signature =
    "35c5efc9c4a87df63301fa0e51cb29e1417676ed798486e7e5bf7fb413bdbfa3549ecb811636a31363c13fea5393202f657d020f1ee1976bef55f7386f6ace65";
  const kaspaAddressStr =
    "kaspa:qr0lr4ml9fn3chekrqmjdkergxl93l4wrk3dankcgvjq776s9wn9jkdskewva";

  it("should pass", async () => {
    const result = await verifySignature(
      message,
      signature,
      KaspaAddress.fromString(kaspaAddressStr),
    );

    expect(result).toEqual(true);
  });

  it("should not pass", async () => {
    const result = await verifySignature(
      "hey world",
      signature,
      KaspaAddress.fromString(kaspaAddressStr),
    );

    expect(result).toEqual(false);
  });
});
