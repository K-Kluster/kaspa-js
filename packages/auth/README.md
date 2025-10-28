# @kluster/kaspa-auth

This package provides tools to implement **Sign-In with Kaspa (SIWK)**, a decentralized authentication method that allows users to log in to a web application using their Kaspa wallet.

It is inspired by [EIP-4361 (Sign-In with Ethereum)](https://eips.ethereum.org/EIPS/eip-4361) and provides utilities to construct and verify SIWK messages according to a canonical format.

## Features

- **Message Construction**: Build canonical, human-readable messages for users to sign.
- **Signature Verification**: Securely verify that a message was signed by the claimed Kaspa address.
- **Built-in Checks**: Includes verification for domain, expiration, nonce, and other standard security fields.
- **TypeScript Support**: Fully typed for robust integration.

## Installation

```bash
npm install @kluster/kaspa-auth
```

## Core Concept

The authentication flow is as follows:

1.  **Client-side**: The user's browser connects to the server.
2.  **Server-side**: The server generates a SIWK message with a unique `nonce` and sends it to the client.
3.  **Client-side**: The user signs the message with their Kaspa wallet (e.g., via a browser extension).
4.  **Client-side**: The client sends the original message fields and the resulting signature to the server.
5.  **Server-side**: The server uses `@kluster/kaspa-auth` to verify the signature and the message fields (nonce, domain, etc.). If valid, the server establishes an authenticated session for the user.

## Usage

### Verifying a SIWK Message

Here is an example of how a server would verify a SIWK message received from a client.

```typescript
import { verifySiwk } from "@kluster/kaspa-auth";
import type { SiwkFields } from "@kluster/kaspa-auth";

// Assume `clientFields` and `clientSignature` are received from the client's request body.
// The `clientFields` object should conform to the `SiwkFields` interface.
const clientFields: SiwkFields = {
  domain: "yourapp.com",
  address: "kaspa:qr0lr4ml9fn3chekrqmjdkergxl93l4wrk3dankcgvjq776s9wn9jkdskewva",
  statement: "Sign in to MyApp.",
  uri: "https://yourapp.com/login",
  version: "1",
  chainId: "kaspa:mainnet",
  nonce: "a_unique_nonce_generated_by_your_server",
  issuedAt: "2025-10-28T10:00:00.000Z",
  expirationTime: "2025-10-28T10:05:00.000Z",
};
const clientSignature = "0x..."; // The hex-encoded signature from the user's wallet

async function handleLogin(fields: SiwkFields, signature: string) {
  const verificationResult = await verifySiwk(fields, signature, {
    // The domain MUST match your server's domain for security
    domain: "yourapp.com",
    // Optional: Implement nonce checking to prevent replay attacks
    checkNonce: async (nonce) => {
      // 1. Check if the nonce exists in your database and is not yet used.
      // 2. If it's valid, mark it as used to prevent it from being used again.
      // 3. Return `true` if the nonce is valid, `false` otherwise.
      console.log(`Verifying nonce: ${nonce}`);
      return true; // This is just an example.
    },
  });

  if (verificationResult.valid) {
    console.log("Authentication successful!");
    // Proceed to create a session for the user associated with `fields.address`.
  } else {
    console.error(`Authentication failed: ${verificationResult.reason}`);
  }
}

handleLogin(clientFields, clientSignature);
```

### Building a Message (Client-Side)

While this package is primarily for backend verification, you can also use `buildMessage` to construct the canonical message that the user needs to sign. This is useful for displaying it in the UI.

```typescript
import { buildMessage } from "@kluster/kaspa-auth";
import type { SiwkFields } from "@kluster/kaspa-auth";

// On the server, before sending to the client to be signed
const fieldsToSign: SiwkFields = {
  domain: "yourapp.com",
  address: "kaspa:qr0lr4ml9fn3chekrqmjdkergxl93l4wrk3dankcgvjq776s9wn9jkdskewva", // The user's address
  statement: "Sign in to MyApp.",
  uri: "https://yourapp.com/login",
  version: "1",
  chainId: "kaspa:mainnet",
  nonce: "server_generated_unique_nonce", // Generate a secure, random nonce
  issuedAt: new Date().toISOString(),
  expirationTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
};

// This creates the human-readable message for the user to sign
const { message } = buildMessage(fieldsToSign);

console.log("--- Please sign the following message with your Kaspa wallet ---");
console.log(message);
console.log("---------------------------------------------------------------");

// The client would receive `fieldsToSign`, ask the user's wallet to sign `message`,
// and then send back the `fieldsToSign` and the resulting signature to the server.
```