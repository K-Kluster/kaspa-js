# Kaspa React Starter Kit

A modern starter kit for building Kaspa applications with React, TypeScript, and Tailwind CSS. This kit provides a foundation for interacting with the Kaspa RPC and showcasing various functionalities in a user-friendly interface.

## Features

- **Kaspa RPC Connectivity**: Connects to the Kaspa RPC server to fetch real-time blockchain data.
- **Modern UI/UX**: Built with `shadcn/ui`.
- **Block DAG Info**: Fetches and displays current information about the Kaspa Block DAG.
- **Balance Checker**: Check balances for specific Kaspa addresses.
- **Live DAA Score**: Subscribe to and view live DAA (Difficulty Adjustment Algorithm) score updates.
- **New Blocks Feed**: Real-time display of newly added blocks, with detailed information available via a dialog.
- **Virtual Chain Changes**: Monitors and displays events related to virtual chain changes, with detailed event data accessible through a dialog.

## Technologies Used

- [**React**](https://react.dev/): A JavaScript library for building user interfaces.
- [**TypeScript**](https://www.typescriptlang.org/): A strongly typed superset of JavaScript that compiles to plain JavaScript.
- [**Vite**](https://vitejs.dev/): A next-generation frontend tooling that provides an extremely fast development experience.
- [**Tailwind CSS**](https://tailwindcss.com/): A utility-first CSS framework for rapidly building custom designs.
- [**shadcn/ui**](https://ui.shadcn.com/): A collection of re-usable components built using Radix UI and Tailwind CSS.
- [**Kaspa WASM**](https://github.com/kaspanet/rusty-kaspa): WebAssembly client for interacting with the Kaspa network.

## Getting Started

### Installation

```bash
npm run i
```

### Running the Development Server

To start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

### Building for Production

To build the application for production:

```bash
npm run build
```

The production-ready files will be generated in the `build` directory.

## Usage

- **Connect to RPC**: Use the "Connect" button in the header to establish a connection to the Kaspa RPC server.
- **Feature Selection**: Select different features from the sidebar to view Block DAG information, check balances, monitor DAA scores, see new blocks, or track virtual chain changes.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the terms of the [ISC License](LICENSE).
