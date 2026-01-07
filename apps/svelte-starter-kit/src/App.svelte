<script lang="ts">
  import { isConnected } from "$lib/rpcStore";
  import { Sheet } from "$lib/components/ui";
  import { cn } from "$lib/utils";

  const features = {
    BlockDagInfo: {
      component: () => import("$lib/features/BlockDagInfo.svelte"),
      label: "Block DAG Info",
    },
    BalanceChecker: {
      component: () => import("$lib/features/BalanceChecker.svelte"),
      label: "Balance Checker",
    },
    BlockAdded: {
      component: () => import("$lib/features/BlockAdded.svelte"),
      label: "Live Blocks",
    },
    VirtualChainChanged: {
      component: () => import("$lib/features/VirtualChainChanged.svelte"),
      label: "Virtual Chain Changed",
    },
    DaaScore: {
      component: () => import("$lib/features/DaaScore.svelte"),
      label: "Live DAA Score",
    },
    MarketStats: {
      component: () => import("$lib/features/MarketStats.svelte"),
      label: "Market Stats",
    },
  };

  let selectedFeature = $state<keyof typeof features>("BlockDagInfo");
  let mobileMenuOpen = $state(false);
</script>

<div
  class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-background text-foreground dark"
>
  <!-- Desktop Sidebar -->
  <div class="hidden border-r border-zinc-800 bg-zinc-900/50 md:block">
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div
        class="flex h-14 items-center border-b border-zinc-800 px-4 lg:h-[60px] lg:px-6"
      >
        <a href="/" class="flex items-center gap-2 font-semibold">
          <span class="">Kaspa Svelte Starter</span>
        </a>
      </div>
      <div class="flex-1">
        <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
          {#each Object.entries(features) as [key, { label }]}
            <button
              onclick={() => (selectedFeature = key as keyof typeof features)}
              class={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                selectedFeature === key
                  ? "bg-zinc-800 text-teal-400"
                  : "text-zinc-400 hover:text-zinc-100",
              )}
            >
              {label}
            </button>
          {/each}
        </nav>
      </div>
    </div>
  </div>

  <div class="flex flex-col">
    <header
      class="flex h-14 items-center gap-4 border-b border-zinc-800 bg-zinc-900/50 px-4 lg:h-[60px] lg:px-6"
    >
      <!-- Mobile Menu Trigger -->
      <Sheet bind:open={mobileMenuOpen} side="left">
        <div class="flex h-14 items-center border-b border-zinc-800 px-4 mb-4">
          <a href="/" class="flex items-center gap-2 font-semibold">
            <span class="">Kaspa Starter</span>
          </a>
        </div>
        <nav class="grid items-start px-2 text-sm font-medium">
          {#each Object.entries(features) as [key, { label }]}
            <button
              onclick={() => {
                selectedFeature = key as keyof typeof features;
                mobileMenuOpen = false;
              }}
              class={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary text-left",
                selectedFeature === key
                  ? "bg-zinc-800 text-teal-400"
                  : "text-zinc-400 hover:text-zinc-100",
              )}
            >
              {label}
            </button>
          {/each}
        </nav>
      </Sheet>

      <button
        class="md:hidden p-2 text-zinc-400 hover:text-white"
        onclick={() => (mobileMenuOpen = true)}
        aria-label="Toggle mobile menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-menu"
          ><line x1="4" x2="20" y1="12" y2="12" /><line
            x1="4"
            x2="20"
            y1="6"
            y2="6"
          /><line x1="4" x2="20" y1="18" y2="18" /></svg
        >
      </button>

      <div class="w-full flex-1">
        <!-- Spacer or Title on Mobile -->
        <span class="md:hidden font-semibold text-sm">
          {features[selectedFeature].label}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <div
          class={cn(
            "h-2.5 w-2.5 rounded-full",
            $isConnected ? "bg-green-500" : "bg-red-500",
          )}
        ></div>
        <span class="text-sm text-muted-foreground hidden sm:inline"
          >{$isConnected ? "Connected" : "Disconnected"}</span
        >
      </div>
    </header>
    <main
      class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-x-hidden"
    >
      <div class="flex items-center hidden md:flex">
        <h1 class="text-lg font-semibold md:text-2xl">
          {features[selectedFeature].label}
        </h1>
      </div>
      <div
        class="flex flex-1 items-start justify-center rounded-lg border border-zinc-800 border-dashed shadow-sm p-4 overflow-hidden"
      >
        {#if selectedFeature}
          {#await features[selectedFeature].component()}
            <div class="flex items-center justify-center p-8 text-zinc-500">
              <span class="loading loading-spinner loading-lg">Loading...</span>
            </div>
          {:then { default: Feature }}
            <div class="w-full max-w-full overflow-x-auto">
              <Feature />
            </div>
          {:catch error}
            <div class="p-4 text-red-500 bg-red-500/10 rounded-lg">
              Error loading component: {error.message}
            </div>
          {/await}
        {/if}
      </div>
    </main>
  </div>
</div>
