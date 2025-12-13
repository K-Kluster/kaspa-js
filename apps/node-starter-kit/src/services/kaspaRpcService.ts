import kaspa, { Resolver, RpcClient } from "@kluster/kaspa-wasm-node";
import * as WebSocket from "ws";

type KaspaRpcEventListener = (event: any) => void;

class KaspaRpcService {
  private rpc: RpcClient | null = null;
  private isConnected: boolean = false;
  private subscribers: Map<string, Set<WebSocket.WebSocket>> = new Map();
  private rpcEventListeners: Map<string, KaspaRpcEventListener> = new Map();

  constructor() {
    kaspa.initConsolePanicHook();
  }

  public getCurrentURL() {
    return this.rpc?.url;
  }

  public async connect() {
    if (this.isConnected) {
      console.log("Kaspa RPC Client already connected.");
      return;
    }

    this.rpc = new RpcClient({
      // hint: you can change to a node url of yours
      // url: "ws://<url>",
      resolver: new Resolver(),
      networkId: "mainnet",
    });

    try {
      await this.rpc.connect({
        timeoutDuration: 2000,
        blockAsyncConnect: true,
      });
      this.isConnected = true;
      console.log("Kaspa RPC Client Connected.");
    } catch (error) {
      console.error("Failed to connect to Kaspa RPC client:", error);
      this.isConnected = false;
      throw error;
    }
  }

  public getRpcClient(): RpcClient {
    if (!this.rpc || !this.isConnected) {
      throw new Error("Kaspa RPC Client is not connected.");
    }
    return this.rpc;
  }

  public isRpcConnected(): boolean {
    return this.isConnected;
  }

  public async getBlockDagInfo() {
    const rpc = this.getRpcClient();
    return rpc.getBlockDagInfo();
  }

  public async getBalancesByAddresses(addresses: string[]) {
    const rpc = this.getRpcClient();
    return rpc.getBalancesByAddresses({ addresses });
  }

  private broadcast(eventName: string, data: any) {
    const clients = this.subscribers.get(eventName);
    if (clients) {
      clients.forEach((ws) => {
        if (ws.readyState === WebSocket.WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: eventName, data }));
        }
      });
    }
  }

  public subscribe(eventName: string, ws: WebSocket.WebSocket) {
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, new Set());
      this.setupRpcEventListener(eventName);
    }
    this.subscribers.get(eventName)?.add(ws);
    console.log(
      `WebSocket subscribed to ${eventName}. Total subscribers: ${this.subscribers.get(eventName)?.size}`,
    );
  }

  public unsubscribe(eventName: string, ws: WebSocket.WebSocket) {
    const clients = this.subscribers.get(eventName);
    if (clients) {
      clients.delete(ws);
      if (clients.size === 0) {
        this.subscribers.delete(eventName);
        this.removeRpcEventListener(eventName);
      }
    }
    console.log(
      `WebSocket unsubscribed from ${eventName}. Remaining subscribers: ${this.subscribers.get(eventName)?.size || 0}`,
    );
  }

  private setupRpcEventListener(eventName: string) {
    if (!this.rpcEventListeners.has(eventName)) {
      const listener: KaspaRpcEventListener = (event: any) => {
        this.broadcast(eventName, event.data);
      };
      this.rpcEventListeners.set(eventName, listener);
      this.getRpcClient().addEventListener(eventName, listener);
      console.log(`Kaspa RPC client event listener added for ${eventName}`);

      // Call the corresponding subscribe method on the RPC client
      this.activateRpcSubscription(eventName);
    }
  }

  private removeRpcEventListener(eventName: string) {
    const listener = this.rpcEventListeners.get(eventName);
    if (listener) {
      this.getRpcClient().removeEventListener(eventName, listener);
      this.rpcEventListeners.delete(eventName);
      console.log(`Kaspa RPC client event listener removed for ${eventName}`);
    }
  }

  private async activateRpcSubscription(eventName: string) {
    try {
      switch (eventName) {
        case "block-added":
          await this.getRpcClient().subscribeBlockAdded();
          break;
        case "virtual-daa-score-changed":
          await this.getRpcClient().subscribeVirtualDaaScoreChanged();
          break;
        case "virtual-chain-changed":
          await this.getRpcClient().subscribeVirtualChainChanged(true);
          break;
        // Add other RPC subscription cases here
        default:
          console.warn(
            `Attempted to activate unknown RPC subscription: ${eventName}`,
          );
      }
      console.log(`Activated RPC subscription for ${eventName}`);
    } catch (error) {
      console.error(
        `Error activating RPC subscription for ${eventName}:`,
        error,
      );
    }
  }
}

export const kaspaRpcService = new KaspaRpcService();
