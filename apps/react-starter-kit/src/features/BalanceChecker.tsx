import React, { useState } from "react";
import { useRpc } from "../context/RpcContext";
import { IGetBalancesByAddressesResponse } from "@kluster/kaspa-wasm-web";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const BalanceChecker: React.FC = () => {
  const { rpc, isConnected } = useRpc();
  const [balances, setBalances] =
    useState<IGetBalancesByAddressesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState(
    "kaspa:qpamkvhgh0kzx50gwvvp5xs8ktmqutcy3dfs9dc3w7lm9rq0zs76vf959mmrp",
  );

  const getBalances = async () => {
    if (!isConnected) {
      setError("RPC client is not connected");
      return;
    }
    if (!address) {
      setError("Please enter an address");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const info = await rpc.getBalancesByAddresses({ addresses: [address] });
      setBalances(info);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Balance Checker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="kaspa:..."
            className="flex-grow"
          />
          <Button onClick={getBalances} disabled={!isConnected || isLoading}>
            {isLoading ? "Loading..." : "Get Balance"}
          </Button>
        </div>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {balances && (
          <pre className="mt-4 bg-muted p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(
              balances,
              (key, value) =>
                typeof value === "bigint" ? value.toString() : value,
              2,
            )}
          </pre>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceChecker;
