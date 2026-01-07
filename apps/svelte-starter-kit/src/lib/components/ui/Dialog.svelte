<script lang="ts">
  import { cn } from "$lib/utils";

  interface Props {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: import("svelte").Snippet;
    title?: string;
    description?: string;
    class?: string;
  }

  let {
    open = $bindable(false),
    children,
    title,
    description,
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
    "backdrop:bg-black/50 backdrop:backdrop-blur-sm fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-zinc-950 p-6 shadow-lg border border-zinc-800 text-zinc-50",
    className,
  )}
>
  <!-- Close X -->
  <button
    onclick={close}
    class="absolute right-4 top-4 text-zinc-400 hover:text-white"
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

  <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
    {#if title}
      <h2 class="text-lg font-semibold leading-none tracking-tight">{title}</h2>
    {/if}
    {#if description}
      <p class="text-sm text-zinc-400">{description}</p>
    {/if}
  </div>

  {@render children?.()}
</dialog>
