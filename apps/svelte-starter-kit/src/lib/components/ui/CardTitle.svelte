<script lang="ts">
  import { cn } from "$lib/utils";

  let { class: className = undefined, children, ...rest } = $props();
</script>

<h3
  class={cn("font-semibold leading-none tracking-tight", className)}
  {...rest}
>
  {@render children()}
</h3>
