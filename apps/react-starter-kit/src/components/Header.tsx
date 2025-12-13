import React from "react";
import { useRpc } from "../context/RpcContext";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeProvider";
import { Moon, Sun } from "lucide-react";

const Header: React.FC = () => {
  const { isConnected, isConnecting, connect, disconnect, url, error } =
    useRpc();
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-full flex-1">
      <div className="flex items-center justify-end space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        {isConnected && (
          <span className="text-green-500 text-sm">Connected to {url}</span>
        )}
        {isConnecting && (
          <span className="text-yellow-500 text-sm">Connecting...</span>
        )}
        {!isConnected && !isConnecting && (
          <span className="text-red-500 text-sm">Disconnected</span>
        )}

        <Button
          onClick={isConnected ? disconnect : connect}
          disabled={isConnecting}
          size="sm"
        >
          {isConnecting
            ? "Connecting..."
            : isConnected
              ? "Disconnect"
              : "Connect"}
        </Button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
    </div>
  );
};

export default Header;
