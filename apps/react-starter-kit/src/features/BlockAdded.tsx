import React, { useEffect, useState } from "react";
import { useRpc } from "../context/RpcContext";
import { Block } from "../lib/kaspa-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

const BlockAdded: React.FC = () => {
  const { rpc, isConnected } = useRpc();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  useEffect(() => {
    if (!isConnected || isPaused) {
      return;
    }

    const handleBlockAdded = (event: any) => {
      setBlocks((prevBlocks) => [event.data.block, ...prevBlocks.slice(0, 9)]);
    };

    const subscribe = async () => {
      try {
        await rpc.subscribeBlockAdded();
        rpc.addEventListener("block-added", handleBlockAdded);
      } catch (e: any) {
        setError(e.message);
      }
    };

    subscribe();

    return () => {
      rpc.removeEventListener("block-added", handleBlockAdded);
    };
  }, [isConnected, rpc, isPaused]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>New Blocks</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => setIsPaused(!isPaused)}
          className="w-full"
          variant={isPaused ? "default" : "secondary"}
        >
          {isPaused ? "Resume" : "Pause"}
        </Button>

        {error && <div className="text-red-500 mt-4">{error}</div>}

        {selectedBlock && (
          <Dialog
            open={!!selectedBlock}
            onOpenChange={() => setSelectedBlock(null)}
          >
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Block Details: {selectedBlock.verboseData.hash}
                </DialogTitle>
              </DialogHeader>
              <pre className="mt-2 bg-muted p-4 rounded-md overflow-auto text-xs">
                {JSON.stringify(
                  selectedBlock,
                  (key, value) =>
                    typeof value === "bigint" ? value.toString() : value,
                  2,
                )}
              </pre>
              <Button onClick={() => setSelectedBlock(null)}>Close</Button>
            </DialogContent>
          </Dialog>
        )}

        <div className="mt-4 space-y-2">
          {blocks.map((block) => (
            <div
              key={block.verboseData.hash}
              className="bg-muted p-3 rounded-md flex justify-between items-center"
            >
              <div>
                <div className="font-mono text-sm">
                  Hash: {block.verboseData.hash.substring(0, 20)}...
                </div>
                <div className="text-xs text-muted-foreground">
                  DAA Score: {block.header.daaScore} | Txs:{" "}
                  {block.transactions.length}
                </div>
              </div>
              <Button onClick={() => setSelectedBlock(block)} size="sm">
                Details
              </Button>
            </div>
          ))}
        </div>

        {!isConnected && (
          <p className="mt-4 text-muted-foreground">
            Connect to the RPC server to see new blocks.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockAdded;
