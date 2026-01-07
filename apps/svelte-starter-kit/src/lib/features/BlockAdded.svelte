<script lang="ts">
  import { isConnected, rpcClient } from "$lib/rpcStore";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Dialog,
  } from "$lib/components/ui";
  import InfoTooltip from "$lib/components/ui/InfoTooltip.svelte";
  import { Button } from "$lib/components/ui";
  import type { Block } from "@kluster/kaspa-wasm-web";

  let blocks = $state<Block[]>([]);
  let isPaused = $state(false);
  let error = $state<string | null>(null);
  let selectedBlock = $state<Block | null>(null);
  let showDetails = $state(false);

  function openDetails(block: Block) {
    selectedBlock = block;
    showDetails = true;
  }

  // Subscribe logic
  // $effect corresponds to useEffect
  $effect(() => {
    if (!$isConnected || !$rpcClient || isPaused) return;

    const handleBlockAdded = (event: any) => {
      // Just take the new block and prepend it
      // Note: Svelte 5 state mutation is fine
      const newBlock = event.data.block as Block;
      blocks = [newBlock, ...blocks.slice(0, 9)];
    };

    const subscribe = async () => {
      try {
        if (!$rpcClient) return; // double check
        await $rpcClient.subscribeBlockAdded();

        // The WASM event listener pattern might vary slightly in how it's exposed to JS/TS
        // But assuming it matches the React starter:
        $rpcClient.addEventListener("block-added", handleBlockAdded);
      } catch (e: any) {
        error = e.message;
      }
    };

    subscribe();

    return () => {
      if ($rpcClient) {
        try {
          $rpcClient.removeEventListener("block-added", handleBlockAdded);
        } catch (e) {
          /* ignore cleanup error if any */
        }
      }
    };
  });
</script>

<Card class="w-full">
  <CardHeader>
    <CardTitle class="flex items-center">
      Live Blocks (Real-time)
      <InfoTooltip
        text="Watch the network grow in real-time. Since Kaspa is fast, you'll see many blocks appearing every second, unlike Bitcoin's one block every 10 minutes."
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
      <div class="text-red-500 mt-4">{error}</div>
    {/if}

    <div class="space-y-2">
      {#each blocks as block (block.verboseData.hash)}
        <div class="bg-muted p-3 rounded-md flex justify-between items-center">
          <div>
            <div class="font-mono text-sm">
              Hash: {block.verboseData.hash.substring(0, 20)}...
            </div>
            <div class="text-xs text-muted-foreground">
              DAA Score: {block.header.daaScore} | Txs: {block.transactions
                .length}
            </div>
          </div>
          <!-- Details button -->
          <Button size="sm" variant="outline" onclick={() => openDetails(block)}
            >Details</Button
          >
        </div>
      {/each}

      {#if selectedBlock}
        <Dialog
          bind:open={showDetails}
          title={`Block Details: ${selectedBlock.verboseData.hash}`}
          class="sm:max-w-[800px]"
        >
          <div
            class="mt-2 bg-zinc-900 p-4 rounded-md overflow-auto text-xs max-h-[60vh] font-mono text-zinc-300"
          >
            <pre>{JSON.stringify(
                selectedBlock,
                (key, value) =>
                  typeof value === "bigint" ? value.toString() : value,
                2,
              )}</pre>
          </div>
          <div class="flex justify-end mt-4">
            <Button variant="secondary" onclick={() => (showDetails = false)}
              >Close</Button
            >
          </div>
        </Dialog>
      {/if}
      {#if blocks.length === 0}
        <div class="text-center text-muted-foreground py-8">
          Waiting for new blocks...
        </div>
      {/if}
    </div>
  </CardContent>
</Card>
