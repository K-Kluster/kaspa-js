<script lang="ts">
  import { cn } from "$lib/utils";

  interface Props {
    text: string;
    class?: string;
  }

  let { text, class: className }: Props = $props();
  let show = $state(false);
</script>

<div class={cn("relative inline-block ml-2 group", className)}>
  <button
    class="text-zinc-400 hover:text-white transition-colors focus:outline-none cursor-pointer bg-zinc-800/50 hover:bg-zinc-700 p-1.5 rounded-full"
    onclick={(e) => {
      console.log("TOOLTIP-DEBUG: Button clicked");
      e.stopPropagation();
      show = !show;
      console.log("TOOLTIP-DEBUG: New show state:", show);
    }}
    aria-label="Info"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-info"
      ><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path
        d="M12 8h.01"
      /></svg
    >
  </button>

  {#if show}
    <div
      class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-sm p-6 rounded-xl bg-zinc-950 border border-zinc-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-base leading-relaxed text-zinc-100 z-[9999] animate-in fade-in zoom-in-95 duration-200 md:w-80 md:text-sm"
      onclick={(e) => e.stopPropagation()}
      role="tooltip"
    >
      {text}
      {text}
    </div>
    <!-- Backdrop for click-outside close (transparent on desktop, dimmed on mobile) -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="fixed inset-0 z-[9990] bg-black/50 md:bg-transparent"
      onclick={() => (show = false)}
    ></div>
  {/if}
</div>
