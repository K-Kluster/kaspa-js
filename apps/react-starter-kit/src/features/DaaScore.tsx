import React, { useEffect, useState } from "react";
import { useRpc } from "../context/RpcContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const DaaScore: React.FC = () => {
  const { rpc, isConnected } = useRpc();
  const [daaScore, setDaaScore] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    const handleDaaScoreChanged = (event: any) => {
      setDaaScore(event.data.virtualDaaScore);
    };

    const subscribe = async () => {
      try {
        await rpc.subscribeVirtualDaaScoreChanged();
        rpc.addEventListener(
          "virtual-daa-score-changed",
          handleDaaScoreChanged,
        );
      } catch (e: any) {
        setError(e.message);
      }
    };

    subscribe();

    return () => {
      rpc.removeEventListener(
        "virtual-daa-score-changed",
        handleDaaScoreChanged,
      );
    };
  }, [isConnected, rpc]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Live DAA Score</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {isConnected ? (
          <div>
            <p>Subscribed to DAA score updates.</p>
            {daaScore !== null ? (
              <p className="text-2xl font-mono mt-2">{daaScore.toString()}</p>
            ) : (
              <p>Waiting for first event...</p>
            )}
          </div>
        ) : (
          <p>Connect to the RPC server to see live DAA score updates.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DaaScore;
