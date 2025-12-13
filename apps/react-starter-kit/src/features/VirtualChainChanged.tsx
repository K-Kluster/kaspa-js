import React, { useEffect, useState } from "react";
import { useRpc } from "../context/RpcContext";
import { VirtualChainEventData } from "../lib/kaspa-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

const VirtualChainChanged: React.FC = () => {
  const { rpc, isConnected } = useRpc();
  const [events, setEvents] = useState<VirtualChainEventData[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] =
    useState<VirtualChainEventData | null>(null);

  useEffect(() => {
    if (!isConnected || isPaused) {
      return;
    }

    const handleEvent = (event: any) => {
      setEvents((prevEvents) => [event.data, ...prevEvents.slice(0, 15)]);
    };

    const subscribe = async () => {
      try {
        await rpc.subscribeVirtualChainChanged(true);
        rpc.addEventListener("virtual-chain-changed", handleEvent);
      } catch (e: any) {
        setError(e.message);
      }
    };

    subscribe();

    return () => {
      rpc.removeEventListener("virtual-chain-changed", handleEvent);
    };
  }, [isConnected, rpc, isPaused]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Virtual Chain Changes</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => setIsPaused(!isPaused)}
          className="w-full"
          variant={isPaused ? "default" : "secondary"}
        >
          {isPaused ? "Resume" : "Pause"}
        </Button>

        {error && <div className="text-red-400 mt-4">{error}</div>}

        <div className="mt-4 space-y-2">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-muted p-3 rounded-md flex justify-between items-center"
            >
              <div>
                <span className="font-semibold text-green-300">
                  Added: {event.addedChainBlockHashes.length}
                </span>
                ,{" "}
                <span className="font-semibold text-red-300">
                  Removed: {event.removedChainBlockHashes.length}
                </span>
                ,{" "}
                <span className="font-semibold text-blue-300">
                  Accepted Txs: {event.acceptedTransactionIds.length}
                </span>
              </div>
              <Button onClick={() => setSelectedEvent(event)} size="sm">
                Details
              </Button>
            </div>
          ))}
        </div>

        {selectedEvent && (
          <Dialog
            open={!!selectedEvent}
            onOpenChange={() => setSelectedEvent(null)}
          >
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Virtual Chain Event Details</DialogTitle>
              </DialogHeader>
              <pre className="mt-2 bg-muted p-4 rounded-md overflow-auto text-xs">
                {JSON.stringify(
                  selectedEvent,
                  (_, value) =>
                    typeof value === "bigint" ? value.toString() : value,
                  2,
                )}
              </pre>
              <Button onClick={() => setSelectedEvent(null)}>Close</Button>
            </DialogContent>
          </Dialog>
        )}

        {!isConnected && (
          <p className="mt-4 text-muted-foreground">
            Connect to the RPC server to see virtual chain changes.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default VirtualChainChanged;
