<script lang="ts">
  import { isConnected, rpcClient } from "$lib/rpcStore";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui";
  import { Button } from "$lib/components/ui";
  import { Input } from "$lib/components/ui";
  import type { IGetBalancesByAddressesResponse } from "@kluster/kaspa-wasm-web";

  let balances = $state<IGetBalancesByAddressesResponse | null>(null);
  let error = $state<string | null>(null);
  let isLoading = $state(false);
  let address = $state(
    "kaspa:qpamkvhgh0kzx50gwvvp5xs8ktmqutcy3dfs9dc3w7lm9rq0zs76vf959mmrp",
  );

  async function getBalances() {
    if (!$isConnected || !$rpcClient) {
      error = "RPC client is not connected";
      return;
    }
    if (!address) {
      error = "Please enter an address";
      return;
    }
    error = null;
    isLoading = true;
    try {
      // @ts-ignore
      const info = await $rpcClient.getBalancesByAddresses({
        addresses: [address],
      });
      balances = info;
    } catch (e: any) {
      error = e.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<Card class="w-full">
  <CardHeader>
    <CardTitle>Balance Checker</CardTitle>
  </CardHeader>
  <CardContent>
    <div class="flex space-x-2">
      <Input
        type="text"
        bind:value={address}
        placeholder="kaspa:..."
        class="flex-grow"
      />
      <Button onclick={getBalances} disabled={!$isConnected || isLoading}>
        {isLoading ? "Loading..." : "Get Balance"}
      </Button>
    </div>
    {#if error}
      <div class="text-red-500 mt-4">{error}</div>
    {/if}
    {#if balances}
      <pre class="mt-4 bg-muted p-4 rounded-md overflow-auto text-sm">
        {JSON.stringify(
          balances,
          (key, value) =>
            typeof value === "bigint" ? value.toString() : value,
          2,
        )}
      </pre>
    {/if}
  </CardContent>
</Card>
