<script lang="ts">
  import { cn } from "$lib/utils";

  interface Props {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: import("svelte").Snippet;
    side?: "left" | "right";
    class?: string;
  }

  let {
    open = $bindable(false),
    children,
    side = "left",
    class: className,
  }: Props = $props();

  let dialog: HTMLDialogElement;

  $effect(() => {
    if (dialog) {
      if (open && !dialog.open) {
        dialog.showModal();
      } else if (!open && dialog.open) {
        dialog.close();
      }
    }
  });

  function close() {
    open = false;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialog}
  onclose={close}
  onclick={(e) => {
    if (e.target === dialog) close();
  }}
  class={cn(
    "fixed z-50 gap-4 bg-zinc-950 p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
    "backdrop:bg-black/80 backdrop:backdrop-blur-sm",
    "m-0 h-full max-h-none w-3/4 max-w-sm border-r border-zinc-800", // Left side default styles
    side === "left" &&
      "left-0 top-0 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
    side === "right" &&
      "right-0 top-0 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
    className,
  )}
>
  <button
    onclick={close}
    class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary text-zinc-400 hover:text-white"
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
      class="h-4 w-4"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
    >
    <span class="sr-only">Close</span>
  </button>

  <div class="flex flex-col h-full">
    {@render children?.()}
  </div>
</dialog>

<style>
  /* Basic animations for dialog if tailwind animate plugin isn't fully configured/working for dialogs */
  dialog[open] {
    animation: fade-in 200ms forwards;
  }
  dialog[open]::backdrop {
    animation: fade-in 200ms forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
