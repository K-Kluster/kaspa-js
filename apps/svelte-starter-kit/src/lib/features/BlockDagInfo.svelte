<script lang="ts">
  import { isConnected, rpcClient } from "$lib/rpcStore";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui";
  import { Button } from "$lib/components/ui";
  import InfoTooltip from "$lib/components/ui/InfoTooltip.svelte";
  import type { IGetBlockDagInfoResponse } from "@kluster/kaspa-wasm-web";

  let dagInfo = $state<IGetBlockDagInfoResponse | null>(null);
  let error = $state<string | null>(null);
  let isLoading = $state(false);

  async function getDagInfo() {
    if (!$isConnected || !$rpcClient) {
      error = "RPC client is not connected";
      return;
    }
    error = null;
    isLoading = true;
    try {
      const info = await $rpcClient.getBlockDagInfo();
      dagInfo = info;
    } catch (e: any) {
      error = e.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<Card class="w-full">
  <CardHeader>
    <CardTitle class="flex items-center">
      Block DAG Info
      <InfoTooltip
        text="Unlike Bitcoin which forms a single line (chain), Kaspa forms a web (DAG). 'Tips' are the newest additions to this web, waiting for new blocks to reference them."
      />
    </CardTitle>
  </CardHeader>
  <CardContent>
    <Button onclick={getDagInfo} disabled={!$isConnected || isLoading}>
      {isLoading ? "Loading..." : "Get DAG Info"}
    </Button>
    {#if error}
      <div class="text-red-500 mt-4">{error}</div>
    {/if}
    {#if dagInfo}
      <pre class="mt-4 bg-muted p-4 rounded-md overflow-auto text-sm">
        {JSON.stringify(
          dagInfo,
          (_, value) => (typeof value === "bigint" ? value.toString() : value),
          2,
        )}
      </pre>
    {/if}
  </CardContent>
</Card>
