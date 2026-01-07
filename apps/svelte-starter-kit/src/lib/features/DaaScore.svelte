<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { rpcClient, isConnected } from "$lib/rpcStore";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui";
  import InfoTooltip from "$lib/components/ui/InfoTooltip.svelte";

  let daaScore = $state<bigint | null>(null);
  let error = $state<string | null>(null);

  function handleDaaScoreChanged(event: any) {
    daaScore = event.data.virtualDaaScore;
  }

  function formatScore(score: bigint) {
    return new Intl.NumberFormat("en-US").format(score);
  }

  async function subscribe() {
    if (!$rpcClient || !$isConnected) return;
    try {
      await $rpcClient.subscribeVirtualDaaScoreChanged();
      $rpcClient.addEventListener(
        "virtual-daa-score-changed",
        handleDaaScoreChanged,
      );
    } catch (e: any) {
      error = e.message;
    }
  }

  function unsubscribe() {
    if ($rpcClient) {
      $rpcClient.removeEventListener(
        "virtual-daa-score-changed",
        handleDaaScoreChanged,
      );
    }
  }

  // React to connection changes
  $effect(() => {
    if ($isConnected) {
      subscribe();
    } else {
      unsubscribe();
    }
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<Card class="w-full">
  <CardHeader>
    <CardTitle class="flex items-center">
      Live DAA Score
      <InfoTooltip
        text="Think of this as the network's heartbeat counter. It grows steadily as the network processes transactions. A higher score means more proof-of-work has been secured."
      />
    </CardTitle>
  </CardHeader>
  <CardContent>
    {#if error}
      <div class="text-red-500 mt-4">{error}</div>
    {/if}
    {#if $isConnected}
      <div>
        <div class="text-sm text-muted-foreground mb-4">
          This number increases every second as new blocks are added to the DAG.
        </div>
        {#if daaScore !== null}
          <p
            class="text-4xl font-mono mt-2 font-bold tracking-tight text-teal-400"
          >
            {formatScore(daaScore)}
          </p>
        {:else}
          <p class="animate-pulse text-muted-foreground">
            Waiting for network...
          </p>
        {/if}
      </div>
    {:else}
      <p>Connect to the RPC server to see live DAA score updates.</p>
    {/if}
  </CardContent>
</Card>
