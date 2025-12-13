# Kluster Kaspa JS Utilities

This monorepo contains a collection of TypeScript libraries for Kaspa, with a focus on authentication and address handling.

## Requirements

- Node.js v20+

## Starter Kits

To getting started quickly with a Kaspa-capable application, use the CLI: `npx @kluster/kaspa-starter-cli`.

![CLI Demo](./docs/cli-usage.gif)

## Packages

| Package                                                                  | Description                                                                          |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| **[@kluster/kaspa-address](./packages/address/README.md)**               | A library for encoding and decoding Kaspa addresses.                                 |
| **[@kluster/kaspa-signature](./packages/signature/README.md)**           | Utilities for verifying Schnorr signatures against Kaspa addresses.                  |
| **[@kluster/kaspa-auth](./packages/auth/README.md)**                     | An implementation of **Sign-In with Kaspa (SIWK)** for decentralized authentication. |
| **[@kluster/kaspa-starter-cli](./packages/kaspa-starter-cli/README.md)** | A simple CLI to quickly bootstrap a Kaspa-capable application.                       |

## Applications

This repository also includes example web applications demonstrating the integration of Kaspa and these packages.

| Package                                           | Description                                                                                          |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **[react-starter-kit](./apps/react-starter-kit)** | A React starter kit showcasing a Kaspa integration.                                                  |
| **[node-starter-kit](./apps/node-starter-kit)**   | A Node.js starter kit showcasing a Kaspa integration.                                                |
| **[kip-12-dapp](./apps/kip-12-dapp)**             | KIP-12 dApp example - interact with KIP-12 compatible browser extension wallets.                     |
| **[signing-tool](./apps/signing-tool)**           | Application showcasing signing capabilities. ([live version](https://kluster-kaspa-auth.pages.dev/)) |

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

## Versioning & Publish

- `npx @changesets/cli` - bump packages versions
- `npx @changesets/cli version` - apply version changes and changelogs
- `npx @changesets/cli publish` - publish bumped on npm
