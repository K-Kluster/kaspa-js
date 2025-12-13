import { useEffect, useState } from "react";

export interface KaspaProvider {
  request: (method: string, args: any[]) => Promise<any>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export interface ProviderInfo {
  id: string;
  name: string;
  icon: string;
  methods: string[];
}

export interface Message {
  eventId: string;
  extensionId: string;
  method: string;
  args?: any[];
  error?: any;
  data?: any;
}

declare global {
  interface Window {
    kaspaProvider: KaspaProvider;
  }
}

export function useKaspaProvider() {
  const [provider, setProvider] = useState<KaspaProvider | null>(null);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);

  useEffect(() => {
    const handleProvider = (event: CustomEvent) => {
      const { info, provider } = event.detail;
      setProvider(provider);
      setProviderInfo(info);
    };

    window.addEventListener("kaspa:provider", handleProvider);
    window.dispatchEvent(new CustomEvent("kaspa:requestProvider"));

    return () => {
      window.removeEventListener("kaspa:provider", handleProvider);
    };
  }, []);

  return { provider, providerInfo };
}
