# Kaspa Starter CLI

A simple CLI to bootstrap a new Kaspa project.

## Usage

To use the CLI, run the following command and follow the prompts:

```bash
npx @kluster/kaspa-starter-cli
```

This will create a new directory with the chosen starter kit (React or Node.js), download the necessary Kaspa WASM SDK, and install all dependencies.

### Development

To run the CLI in development mode:

1. Clone the repository.
2. Navigate to `packages/kaspa-starter-cli`.
3. Run `npm install` to install dependencies.
4. Run `npm run build` to build the CLI.
5. Run `npm link --force` to make the `kaspa-starter` command available globally.
6. Run `kaspa-starter --dev` in any directory to test the CLI. (without --dev, it fetches from the repository)
