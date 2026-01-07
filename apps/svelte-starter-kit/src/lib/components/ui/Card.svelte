<script lang="ts">
  import { cn } from "$lib/utils";

  let { class: className = undefined, children, ...rest } = $props();
</script>

<div
  class={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
  {...rest}
>
  {@render children()}
</div>
