"use client";

import { useState, useEffect } from "react";
import { useKaspaProvider } from "../lib/kaspaProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  const { provider, providerInfo } = useKaspaProvider();
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Disconnected");
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [methodArgs, setMethodArgs] = useState<string>("");

  useEffect(() => {
    if (providerInfo?.methods?.[0]) {
      setSelectedMethod(providerInfo.methods[0]);
    }
  }, [providerInfo]);

  const addLog = (log: any) => {
    const timestamp = new Date().toLocaleTimeString();
    const logString =
      typeof log === "string" ? log : JSON.stringify(log, null, 2);
    setLogs((prevLogs) => [...prevLogs, `[${timestamp}] ${logString}`]);
  };

  const connect = async () => {
    try {
      await provider?.connect();
      setConnectionStatus("Connected");
      addLog("Connected successfully!");
    } catch (e: any) {
      setConnectionStatus("Disconnected");
      addLog(`Error: ${e.message}`);
    }
  };

  const disconnect = async () => {
    try {
      await provider?.disconnect();
      setConnectionStatus("Disconnected");
      addLog("Disconnected successfully!");
    } catch (e: any) {
      addLog(`Error: ${e.message}`);
    }
  };

  const sendRequest = async () => {
    if (!selectedMethod) {
      addLog("Error: No method selected.");
      return;
    }
    try {
      const args = methodArgs ? JSON.parse(methodArgs) : [];
      addLog(`Sending request: ${selectedMethod}(${JSON.stringify(args)})`);
      const res = await provider?.request(selectedMethod, args);
      addLog(`Response: ${JSON.stringify(res, null, 2)}`);
    } catch (e: any) {
      addLog(`Error: ${e.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Provider Info</CardTitle>
          </CardHeader>
          <CardContent>
            {providerInfo ? (
              <div>
                <img width={64} src={providerInfo.icon} />
                <p>ID: {providerInfo.id}</p>
                <p>Name: {providerInfo.name}</p>
                <p>Methods: {providerInfo.methods.join(", ")}</p>
              </div>
            ) : (
              <p>No provider found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connection</CardTitle>
            <CardDescription>Status: {connectionStatus}</CardDescription>
          </CardHeader>
          <CardFooter className="flex space-x-2">
            <Button
              onClick={connect}
              disabled={connectionStatus === "Connected"}
            >
              Connect
            </Button>
            <Button
              onClick={disconnect}
              disabled={connectionStatus === "Disconnected"}
              variant="destructive"
            >
              Disconnect
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <Select onValueChange={setSelectedMethod} value={selectedMethod}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select a method" />
                </SelectTrigger>
                <SelectContent>
                  {providerInfo?.methods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="args">Arguments (JSON Array)</Label>
              <Textarea
                id="args"
                placeholder='["arg1", "arg2"]'
                value={methodArgs}
                onChange={(e) => setMethodArgs(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={sendRequest} className="w-full">
              Send Request
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              className="h-[500px] resize-none"
              readOnly
              value={logs.join("\n")}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
