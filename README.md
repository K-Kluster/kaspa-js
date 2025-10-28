# Kluster Kaspa JS Utilities

This monorepo contains a collection of TypeScript libraries for Kaspa, with a focus on authentication and address handling.

## Packages

| Package                                                        | Description                                                                          |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **[@kluster/kaspa-address](./packages/address/README.md)**     | A library for encoding and decoding Kaspa addresses.                                 |
| **[@kluster/kaspa-signature](./packages/signature/README.md)** | Utilities for verifying Schnorr signatures against Kaspa addresses.                  |
| **[@kluster/kaspa-auth](./packages/auth/README.md)**           | An implementation of **Sign-In with Kaspa (SIWK)** for decentralized authentication. |

## Applications

This repository also includes an example web application demonstrating the usage of these packages.

- **[Web App](./apps/web/README.md)**: A Next.js application that shows how to implement a SIWK flow.

This application has been deployed for public access here: https://kluster-kaspa-auth.pages.dev/

## Development

This is a Turborepo-based monorepo.

To install dependencies from the root:

```bash
npm install
```

To build all packages and apps:

```bash
npm run build
```
