import { ProviderInfo, KaspaProvider } from "../lib/kaspaProvider";

declare global {
  interface WindowEventMap {
    "kaspa:provider": CustomEvent<{
      info: ProviderInfo;
      provider: KaspaProvider;
    }>;
    "kaspa:requestProvider": CustomEvent;
  }
}
