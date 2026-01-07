<script lang="ts">
  import { onDestroy } from "svelte";
  import { rpcClient, isConnected } from "$lib/rpcStore";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Dialog,
  } from "$lib/components/ui";
  import InfoTooltip from "$lib/components/ui/InfoTooltip.svelte";

  // Define types locally since we don't have the full types package setup yet
  interface VirtualChainEventData {
    addedChainBlockHashes: string[];
    removedChainBlockHashes: string[];
    acceptedTransactionIds: string[];
  }

  let events = $state<VirtualChainEventData[]>([]);
  let isPaused = $state(false);
  let error = $state<string | null>(null);
  let selectedEvent = $state<VirtualChainEventData | null>(null);

  function handleEvent(event: any) {
    if (!isPaused) {
      events = [event.data, ...events.slice(0, 15)];
    }
  }

  async function subscribe() {
    if (!$rpcClient || !$isConnected) return;
    try {
      await $rpcClient.subscribeVirtualChainChanged(true);
      $rpcClient.addEventListener("virtual-chain-changed", handleEvent);
    } catch (e: any) {
      error = e.message;
    }
  }

  function unsubscribe() {
    if ($rpcClient) {
      $rpcClient.removeEventListener("virtual-chain-changed", handleEvent);
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
      Virtual Chain Changes
      <InfoTooltip
        text="The 'Virtual Chain' is Kaspa's way of ordering the parallel blocks. This event fires when the network agrees on the authoritative sequence of transactions."
      />
    </CardTitle>
  </CardHeader>
  <CardContent>
    <Button
      onclick={() => (isPaused = !isPaused)}
      class="w-full mb-4"
      variant={isPaused ? "default" : "secondary"}
    >
      {isPaused ? "Resume" : "Pause"}
    </Button>

    {#if error}
      <div class="text-red-400 mt-4">{error}</div>
    {/if}

    <div class="mt-4 space-y-2">
      {#each events as event, index}
        <div
          class="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-md flex justify-between items-center"
        >
          <div class="text-sm">
            <span class="font-semibold text-green-600 dark:text-green-400">
              Added: {event.addedChainBlockHashes.length}
            </span>,
            <span class="font-semibold text-red-600 dark:text-red-400">
              Removed: {event.removedChainBlockHashes.length}
            </span>,
            <span class="font-semibold text-blue-600 dark:text-blue-400">
              Accepted Txs: {event.acceptedTransactionIds.length}
            </span>
          </div>
          <Button
            onclick={() => (selectedEvent = event)}
            size="sm"
            variant="outline"
          >
            Details
          </Button>
        </div>
      {/each}
    </div>

    <!-- Details Dialog -->
    <Dialog
      open={!!selectedEvent}
      onOpenChange={() => (selectedEvent = null)}
      title="Virtual Chain Event Details"
    >
      <div class="max-h-[60vh] overflow-y-auto">
        <pre
          class="bg-zinc-950 text-zinc-50 p-4 rounded-md text-xs overflow-auto">
{JSON.stringify(
            selectedEvent,
            (_, value) =>
              typeof value === "bigint" ? value.toString() : value,
            2,
          )}
            </pre>
      </div>
      <div class="mt-4 flex justify-end">
        <Button onclick={() => (selectedEvent = null)}>Close</Button>
      </div>
    </Dialog>

    {#if !$isConnected}
      <p class="mt-4 text-muted-foreground">
        Connect to the RPC server to see virtual chain changes.
      </p>
    {/if}
  </CardContent>
</Card>
