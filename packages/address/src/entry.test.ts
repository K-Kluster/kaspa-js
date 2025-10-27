import { describe, it, expect } from "@jest/globals";
import { KaspaAddress } from "./entry.js";

describe("KaspaAddress", () => {
  it("should encode/decode", () => {
    const str =
      "kaspa:qqjmak7xtwq8kn57ngjt0fcw59jgh7nrxc4q59kj0g2gqgyktfeucgwqm3fnl";

    const kaspaAddress = KaspaAddress.fromString(str);

    expect(kaspaAddress).toBeDefined();
    expect(kaspaAddress.toString()).toEqual(str);
    expect(kaspaAddress.payload).toHaveLength(32);
  });

  it("should throw if prefix is invalid", () => {
    const str =
      "invalid:qqjmak7xtwq8kn57ngjt0fcw59jgh7nrxc4q59kj0g2gqgyktfeucgwqm3fnl";

    expect(() => KaspaAddress.fromString(str)).toThrow();
  });

  it("should fail if payload is invalid", () => {
    const str =
      "kaspa:qrjmak7xtwq8kn57ngjt0fcw59jgh7nrxc4q59kj0g2gqgyktfeucgwqm3fnl";

    expect(() => KaspaAddress.fromString(str)).toThrow();
  });
});
