import { app, server, wss } from "./app.ts";
import { kaspaRpcService } from "./services/kaspaRpcService.ts";

const PORT = process.env.PORT || 3000;

const boot = async () => {
  try {
    console.log("Connecting to Kaspa RPC...");
    await kaspaRpcService.connect();
    console.log(`Kaspa RPC connected to ${kaspaRpcService.getCurrentURL()}`);
    // console.log(await kaspaRpcService.getBlockDagInfo()); // Temporarily comment out for server startup
  } catch (error) {
    console.error("Failed to connect Kaspa RPC on boot:", error);
    // Depending on criticality, you might want to exit the process or try reconnecting
  }

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("API documentation available at /api-docs");
  });
};

boot().catch(console.error);
