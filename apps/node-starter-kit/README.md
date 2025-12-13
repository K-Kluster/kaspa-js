# Kaspa Node.js Starter Kit

This project provides a starting point for building Node.js applications that interact with the Kaspa network. It includes:

- **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
- **WebSocket Server:** A raw WebSocket implementation for real-time communication, integrated with Kaspa RPC events.
- **Kaspa RPC Service:** A dedicated service for connecting to the Kaspa network and interacting with its RPC methods.
- **Swagger (OpenAPI) Documentation:** Automatically generated API documentation using `swagger-jsdoc` and `swagger-ui-express`.

## Getting Started

### Installation

> Follow the instructions in the [main README.MD](../../README.md).

### Running the Server

To build the project:

```bash
npm run build
```

To start the development server:

```bash
npm run dev
```

The server will typically run on `http://localhost:3000`.

### API Documentation

Once the server is running, you can access the interactive API documentation (Swagger UI) at:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Here you can explore the available REST endpoints and test them directly.

### WebSocket Usage

The WebSocket server runs on the same port as the HTTP server. You can connect to it at `ws://localhost:3000`.

To subscribe to Kaspa RPC events, send a JSON message in the following format:

```json
{
  "type": "subscribe",
  "event": "block-added"
}
```

Available events to subscribe to:

- `block-added`
- `virtual-daa-score-changed`
- `virtual-chain-changed`

To unsubscribe from an event:

```json
{
  "type": "unsubscribe",
  "event": "block-added"
}
```

Upon successful subscription, you will receive real-time updates for the specified event in JSON format.
