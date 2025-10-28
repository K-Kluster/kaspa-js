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

// --- UI Components ---

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-gray-900 border border-gray-700 rounded-lg p-6 ${className}`}
  >
    {children}
  </div>
);

const Button = ({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

const Input = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="mt-2 w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
);

const Textarea = ({
  value,
  onChange,
  rows,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows: number;
  placeholder?: string;
}) => (
  <textarea
    value={value}
    onChange={onChange}
    rows={rows}
    placeholder={placeholder}
    className="mt-2 w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
);

const SectionTitle = ({
  title,
  actionText,
  onAction,
}: {
  title: string;
  actionText?: string;
  onAction?: () => void;
}) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-white">{title}</h2>
    {actionText && onAction && (
      <span
        className="text-purple-400 cursor-pointer hover:underline"
        onClick={onAction}
      >
        {actionText}
      </span>
    )}
  </div>
);

// --- Main Page Component ---

export default function Home() {
  const [wasm, setWasm] = React.useState<KaspaWasmExports | null>(null);
  const [message, setMessage] = React.useState<string>("");
  const [xprvValue, setXPrvValue] = React.useState<string>("");
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
    const newXprv = new XPrv(mnemonic.toSeed());
    setXPrv(newXprv);
    setXPrvValue(newXprv.toString());
    const address = PublicKeyGenerator.fromMasterXPrv(newXprv, false, 0n)
      .receiveAddress(NetworkType.Mainnet, 0)
      .toString();
    setKaspaAddress(address);
  };

  const handleXprvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setXPrvValue(value);
    try {
      const _xprv = XPrv.fromXPrv(value);
      setXPrv(_xprv);
      const address = PublicKeyGenerator.fromMasterXPrv(_xprv, false, 0n)
        .receiveAddress(NetworkType.Mainnet, 0)
        .toString();
      setKaspaAddress(address);
    } catch (err) {
      setXPrv(undefined);
      setKaspaAddress("");
    }
  };

  const onSignClicked = () => {
    if (!message) {
      setSignError("Message is empty.");
      return;
    }
    if (!xprv) {
      setSignError("xPrv is not valid.");
      return;
    }

    try {
      const newSignature = signMessage({
        message,
        privateKey: new PrivateKeyGenerator(xprv, false, 0n).receiveKey(0),
      });
      setSignature(newSignature);
      setMessageToVerify(message);
      setSignError(null);
    } catch (error) {
      setSignError(String(error));
    }
  };

  const onVerifyClicked = async () => {
    if (!signature || !kaspaAddress || !messageToVerify) {
      setVerifyError("Please fill in all fields for verification.");
      return;
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
    const addressToUse =
      kaspaAddress ||
      "kaspa:qqjmak7xtwq8kn57ngjt0fcw59jgh7nrxc4q59kj0g2gqgyktfeucgwqm3fnl";

    const generatedMessage = buildMessage({
      address: addressToUse,
      chainId: "1337",
      domain: "example.com",
      issuedAt: new Date().toISOString(),
      nonce: "nonce",
      uri: "https://example.com",
      version: "1",
    }).message;

    setMessage(generatedMessage);
    setMessageToVerify(generatedMessage);
  };

  return (
    <main className="container mx-auto p-4 md:p-8 grid gap-8 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Kaspa Signing Tool</h1>
        <p className="text-gray-400 mt-2">
          A developer utility to test and verify Kaspa message signing.
        </p>
      </div>

      {/* Identity Section */}
      <Card>
        <SectionTitle
          title="Identity (xPrv)"
          actionText="Generate Random"
          onAction={onGenerateRandomXPrv}
        />
        <Textarea
          value={xprvValue}
          onChange={handleXprvChange}
          rows={3}
          placeholder="Enter your extended private key (xPrv)"
        />
        {xprvValue && !xprv && (
          <p className="mt-2 text-red-400">Invalid xPrv format.</p>
        )}
        {kaspaAddress && (
          <div className="mt-4">
            <p className="font-semibold">Derived Kaspa Address:</p>
            <p className="text-purple-400 break-all">{kaspaAddress}</p>
          </div>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Signing Section */}
        <Card>
          <SectionTitle
            title="Sign Message"
            actionText="Generate Example"
            onAction={onGenerateRandomMessage}
          />
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            placeholder="Enter the message to sign"
          />
          <div className="mt-6">
            <Button onClick={onSignClicked} disabled={!xprv || !message}>
              Sign Message
            </Button>
          </div>
          {signError && <p className="mt-2 text-red-400">{signError}</p>}
          {signature && (
            <div className="mt-4">
              <p className="font-semibold">Generated Signature:</p>
              <Textarea
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                rows={4}
              />
            </div>
          )}
        </Card>

        {/* Verification Section */}
        <Card>
          <SectionTitle title="Verify Signature" />
          <div>
            <label className="font-semibold">Kaspa Address</label>
            <Input
              value={kaspaAddress}
              onChange={(e) => setKaspaAddress(e.target.value)}
              placeholder="kaspa:..."
            />
          </div>
          <div className="mt-4">
            <label className="font-semibold">Original Message</label>
            <Textarea
              value={messageToVerify}
              onChange={(e) => setMessageToVerify(e.target.value)}
              rows={5}
              placeholder="The message that was signed"
            />
          </div>
          <div className="mt-4">
            <label className="font-semibold">Signature</label>
            <Textarea
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              rows={3}
              placeholder="The signature to verify"
            />
          </div>
          <div className="mt-6">
            <Button
              onClick={onVerifyClicked}
              disabled={!kaspaAddress || !messageToVerify || !signature}
            >
              Verify Signature
            </Button>
          </div>
          {verifyError && <p className="mt-2 text-red-400">{verifyError}</p>}
          {verifyResult === true && (
            <p className="mt-2 text-green-400">
              Signature is valid.
            </p>
          )}
          {verifyResult === false && (
            <p className="mt-2 text-red-400">
              Signature is invalid.
            </p>
          )}
        </Card>
      </div>
    </main>
  );
}