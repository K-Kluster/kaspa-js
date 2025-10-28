"use client";

import React from "react";
import { buildMessage, verifyMessage } from "@kluster/kaspa-auth";
import { initWasm, KaspaWasmExports } from "./init-wasm";
import {
  Mnemonic,
  NetworkType,
  PrivateKeyGenerator,
  PublicKeyGenerator,
  signMessage,
  XPrv,
} from "./kaspa/kaspa";

export default function Home() {
  const [wasm, setWasm] = React.useState<KaspaWasmExports | null>(null);
  const [message, setMessage] = React.useState<string | "">("");
  const [xprvValue, setXPrvValue] = React.useState<string | undefined>("");
  const [xprv, setXPrv] = React.useState<XPrv | undefined>();
  const [signError, setSignError] = React.useState<string | null>(null);
  const [verifyError, setVerifyError] = React.useState<string | null>(null);
  const [signature, setSignature] = React.useState<string>("");
  const [messageToVerify, setMessageToVerify] = React.useState<string>("");
  const [kaspaAddress, setKaspaAddress] = React.useState<string>("");
  const [verifyResult, setVerifyResult] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      const mod = await initWasm();
      setWasm(mod);
    })();
  }, []);

  const onGenerateRandomXPrv = () => {
    const mnemonic = Mnemonic.random();
    const xprv = new XPrv(mnemonic.toSeed());

    setXPrv(xprv);
    setXPrvValue(xprv.toString());

    setKaspaAddress(
      PublicKeyGenerator.fromMasterXPrv(xprv, false, 0n)
        .receiveAddress(NetworkType.Mainnet, 0)
        .toString(),
    );
  };

  const onSignClicked = () => {
    if (message === undefined) {
      setSignError("No message to sign.");
      return;
    }

    if (!xprv) {
      setSignError("No xPrv, cannot sign.");
      return;
    }

    try {
      const signature = signMessage({
        message,
        privateKey: new PrivateKeyGenerator(xprv, false, 0n).receiveKey(0),
      });
      setSignature(signature);
      setSignError("");
    } catch (error) {
      setSignError(String(error));
    }
  };

  const onVerifyClicked = async () => {
    if (!signature) {
      setVerifyError("Need a signature to verify the signature.");
    }

    if (!kaspaAddress) {
      setVerifyError("Need a kaspa address to verify the signature.");
    }

    if (!messageToVerify) {
      setVerifyError(
        "Need an initial message to verify the message signature.",
      );
    }

    try {
      await verifyMessage(messageToVerify, kaspaAddress, signature);
      setVerifyResult(true);
      setVerifyError(null);
    } catch (error) {
      setVerifyError(String(error));
      setVerifyResult(false);
    }
  };

  const onGenerateRandomMessage = () => {
    const kaspaAddressToUse = xprv
      ? PublicKeyGenerator.fromMasterXPrv(xprv, false, 0n)
          .receiveAddress(NetworkType.Mainnet, 0)
          .toString()
      : "kaspa:qqjmak7xtwq8kn57ngjt0fcw59jgh7nrxc4q59kj0g2gqgyktfeucgwqm3fnl";

    const message = buildMessage({
      address: kaspaAddressToUse,
      chainId: "1337",
      domain: "example.com",
      issuedAt: new Date().toISOString(),
      nonce: "nonce",
      uri: "https://example.com",
      version: "1",
    }).message;

    setMessage(message);
    setMessageToVerify(message);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-1/2 mx-auto">
      <div className="mt-12 w-full">
        <h2>
          xPrv:{" "}
          <span
            className="underline select-none cursor-pointer"
            onClick={onGenerateRandomXPrv}
          >
            Generate Random One
          </span>
        </h2>
        <input
          value={xprvValue}
          onChange={(e) => {
            const value = e.target.value;

            try {
              const _xprv = XPrv.fromXPrv(value);

              setXPrv(_xprv);
            } catch (err) {
              console.error(err);
            }

            setXPrvValue(value);
          }}
          className="mt-2 flex items-center justify-center w-full min-h-24 rounded-xl border-purple-950 border"
        />
        <p>xPrv: {xprv?.toString()}</p>
        {xprv ? (
          <p>
            Address:{" "}
            {PublicKeyGenerator.fromMasterXPrv(xprv, false, 0n)
              .receiveAddress(NetworkType.Mainnet, 0)
              .toString()}
          </p>
        ) : null}
      </div>

      <div className="mt-12 w-full">
        <h2>
          Message to Sign:{" "}
          <span
            className="underline select-none cursor-pointer"
            onClick={onGenerateRandomMessage}
          >
            Generate Random One
          </span>
        </h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={8}
          className="mt-2 flex items-center justify-center w-full min-h-24 rounded-xl border-purple-950 border"
        />
      </div>

      <button
        onClick={onSignClicked}
        type="button"
        className="mt-12 py-3 px-4 bg-purple-900 hover:bg-purple-950 transition-colors hover:cursor-pointer"
      >
        Sign
      </button>

      {signError ? <p className="mt-2 text-red-400">{signError}</p> : null}

      <div className="mt-12 w-full">
        <h2 className="mt-2">Initial Message to Verify:</h2>
        <input
          value={messageToVerify}
          onChange={(e) => {
            const value = e.target.value;

            setMessageToVerify(value);
          }}
          className="mt-2 flex items-center justify-center w-full min-h-24 rounded-xl border-purple-950 border"
        />

        <h2>Signature:</h2>
        <input
          value={signature}
          onChange={(e) => {
            const value = e.target.value;

            setSignature(value);
          }}
          className="mt-2 flex items-center justify-center w-full min-h-24 rounded-xl border-purple-950 border"
        />

        <h2 className="mt-2">Kaspa Address:</h2>
        <input
          value={kaspaAddress}
          onChange={(e) => {
            const value = e.target.value;

            setKaspaAddress(value);
          }}
          className="mt-2 flex items-center justify-center w-full min-h-24 rounded-xl border-purple-950 border"
        />
      </div>

      <button
        onClick={onVerifyClicked}
        type="button"
        className="mt-12 py-3 px-4 bg-purple-900 hover:bg-purple-950 transition-colors hover:cursor-pointer"
      >
        Verify
      </button>
      {verifyError ? <p className="mt-2 text-red-400">{verifyError}</p> : null}
      {verifyResult === true ? (
        <p className="mt-2">Signature is valid</p>
      ) : null}
    </div>
  );
}
