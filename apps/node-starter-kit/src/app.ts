import express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import kaspaRoutes from "./routes/kaspaRoutes.ts";
import { kaspaRpcService } from "./services/kaspaRpcService.ts";

const app = express();
app.set("json replacer", (key, value) => {
  // a replacer function to convert bigint to string
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
});
app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Kaspa Node.js Starter Kit API",
      version: "1.0.0",
      description: "API documentation for the Kaspa Node.js Starter Kit",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.send("Kaspa Node.js Starter Kit API");
});

// Kaspa RPC routes
app.use("/kaspa", kaspaRoutes);

// Initialize WebSocket Server
const server = http.createServer(app);
const wss = new WebSocket.WebSocketServer({ server });

wss.on("connection", (ws: WebSocket.WebSocket) => {
  console.log("WebSocket client connected");

  ws.on("message", (message: string) => {
    try {
      const parsedMessage = JSON.parse(message);
      const { type, event } = parsedMessage;

      if (type === "subscribe" && event) {
        kaspaRpcService.subscribe(event, ws);
      } else if (type === "unsubscribe" && event) {
        kaspaRpcService.unsubscribe(event, ws);
      } else {
        ws.send(JSON.stringify({ error: "Invalid WebSocket message format." }));
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
      ws.send(JSON.stringify({ error: "Failed to parse WebSocket message." }));
    }
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
    const allKnownEvents = [
      "block-added",
      "virtual-daa-score-changed",
      "virtual-chain-changed",
    ];
    allKnownEvents.forEach((event) => {
      kaspaRpcService.unsubscribe(event, ws);
    });
  });

  ws.on("error", (error: Error) => {
    console.error("WebSocket error:", error);
  });
});

export { app, server, wss };
