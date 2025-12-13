import { RpcClient, Resolver } from "@kluster/kaspa-wasm-web";
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

const networkId = "mainnet";

interface IRpcContext {
  rpc: RpcClient;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  url: string;
}

const RpcContext = createContext<IRpcContext | null>(null);

export const RpcProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");

  const rpc = useMemo(
    () =>
      new RpcClient({
        resolver: new Resolver(),
        networkId,
      }),
    [],
  );

  const connect = useCallback(async () => {
    if (isConnected || isConnecting) {
      return;
    }
    setIsConnecting(true);
    setError(null);
    try {
      await rpc.connect({
        blockAsyncConnect: true,
        timeoutDuration: 1000,
        retryInterval: 50,
      });
      if (rpc.url === undefined) {
        throw new Error("RPC url is undefined.");
      }
      setUrl(rpc.url);
      setIsConnected(true);
    } catch (e: any) {
      setError(e.message);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [rpc, isConnected, isConnecting]);

  const disconnect = useCallback(async () => {
    if (!isConnected) {
      return;
    }
    await rpc.disconnect();
    setIsConnected(false);
    setUrl("");
  }, [rpc, isConnected]);

  const contextValue: IRpcContext = {
    rpc,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    url,
  };

  return (
    <RpcContext.Provider value={contextValue}>{children}</RpcContext.Provider>
  );
};

export const useRpc = (): IRpcContext => {
  const context = useContext(RpcContext);
  if (!context) {
    throw new Error("useRpc must be used within an RpcProvider");
  }
  return context;
};
