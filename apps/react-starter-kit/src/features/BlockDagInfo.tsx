import React, { useState } from "react";
import { useRpc } from "../context/RpcContext";
import { IGetBlockDagInfoResponse } from "@kluster/kaspa-wasm-web";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const BlockDagInfo: React.FC = () => {
  const { rpc, isConnected } = useRpc();
  const [dagInfo, setDagInfo] = useState<IGetBlockDagInfoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDagInfo = async () => {
    if (!isConnected) {
      setError("RPC client is not connected");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const info = await rpc.getBlockDagInfo();
      setDagInfo(info);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Block DAG Info</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={getDagInfo} disabled={!isConnected || isLoading}>
          {isLoading ? "Loading..." : "Get DAG Info"}
        </Button>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {dagInfo && (
          <pre className="mt-4 bg-muted p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(
              dagInfo,
              (_, value) =>
                typeof value === "bigint" ? value.toString() : value,
              2,
            )}
          </pre>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockDagInfo;
