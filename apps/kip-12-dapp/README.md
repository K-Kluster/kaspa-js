# KIP-12 DApp Example

This is a Next.js application demonstrating the KIP-12 (Kaspa In-browser Provider) specification for interacting with Kaspa browser extension wallets.

## Getting Started

1.  **Install Dependencies (from the root of the monorepo):**

    ```bash
    npm install
    ```

2.  **Run the Development Server:**

    Navigate to the `apps/kip-12-dapp` directory and run:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Interacting with the DApp

To interact with this DApp, you will need a KIP-12 compatible Kaspa wallet browser extension installed and enabled in your browser.

The DApp provides a UI to:

- **Connect/Disconnect** to a KIP-12 compatible wallet.
- Send generic `request` calls to the wallet for methods like `kaspa:send`, `kaspa:sign`, `kaspa:broadcast`.
- Send a custom `kaspa:sign-personal` request to sign an arbitrary message.

Responses and errors from wallet interactions will be displayed in the UI.
