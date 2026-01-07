<script lang="ts">
  import { onMount } from "svelte";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui";

  let price = $state<number | null>(null);
  let hashrate = $state<number | null>(null);
  let supply = $state<number | null>(null);
  let error = $state<string | null>(null);

  async function fetchData() {
    try {
      // Fetch Price
      const priceRes = await fetch("https://api.kaspa.org/info/price");
      const priceData = await priceRes.json();
      price = priceData.price;

      // Fetch Hashrate
      const hashrateRes = await fetch("https://api.kaspa.org/info/hashrate");
      const hashrateData = await hashrateRes.json();
      // Convert to PH/s (it comes in TH/s usually, but let's check docs or assume TH/s based on typical display)
      // Docs say: Returns the current hashrate for Kaspa network in TH/s.
      hashrate = hashrateData.hashrate;

      // Fetch Supply
      const supplyRes = await fetch(
        "https://api.kaspa.org/info/coinsupply/circulating",
      );
      const supplyData = await supplyRes.text(); // Returns a plain number string
      supply = parseFloat(supplyData);
    } catch (e: any) {
      error = "Failed to fetch market data: " + e.message;
    }
  }

  onMount(() => {
    fetchData();
    // Refresh every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  });

  function formatCurrency(val: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(val);
  }

  function formatNumber(val: number) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
      val,
    );
  }
</script>

<div class="grid gap-4 md:grid-cols-3 mb-8">
  <Card
    class="border border-zinc-800 bg-zinc-900/50 shadow-md hover:shadow-lg transition-all duration-300"
  >
    <CardHeader
      class="flex flex-col items-center justify-center pb-2 text-center"
    >
      <div class="p-3 bg-zinc-900 rounded-full mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="h-6 w-6 text-primary"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
      <CardTitle
        class="text-sm font-medium text-muted-foreground uppercase tracking-wider"
        >KAS Price</CardTitle
      >
    </CardHeader>
    <CardContent class="text-center pb-6">
      <div class="text-3xl font-bold tracking-tight">
        {price ? formatCurrency(price) : "..."}
      </div>
    </CardContent>
  </Card>
  <Card
    class="border border-zinc-800 bg-zinc-900/50 shadow-md hover:shadow-lg transition-all duration-300"
  >
    <CardHeader
      class="flex flex-col items-center justify-center pb-2 text-center"
    >
      <div class="p-3 bg-zinc-900 rounded-full mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="h-6 w-6 text-primary"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>
      <CardTitle
        class="text-sm font-medium text-muted-foreground uppercase tracking-wider"
        >Hashrate</CardTitle
      >
    </CardHeader>
    <CardContent class="text-center pb-6">
      <div class="text-3xl font-bold tracking-tight">
        {hashrate ? `${formatNumber(hashrate / 1000)} PH/s` : "..."}
      </div>
      <p class="text-xs text-muted-foreground mt-1">Network Security</p>
    </CardContent>
  </Card>
  <Card
    class="border border-zinc-800 bg-zinc-900/50 shadow-md hover:shadow-lg transition-all duration-300"
  >
    <CardHeader
      class="flex flex-col items-center justify-center pb-2 text-center"
    >
      <div class="p-3 bg-zinc-900 rounded-full mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="h-6 w-6 text-primary"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
      <CardTitle
        class="text-sm font-medium text-muted-foreground uppercase tracking-wider"
        >Circulating Supply</CardTitle
      >
    </CardHeader>
    <CardContent class="text-center pb-6">
      <div class="text-3xl font-bold tracking-tight">
        {supply ? `${formatNumber(supply)} KAS` : "..."}
      </div>
    </CardContent>
  </Card>
</div>

{#if error}
  <div class="text-red-500 text-sm p-4">{error}</div>
{/if}
