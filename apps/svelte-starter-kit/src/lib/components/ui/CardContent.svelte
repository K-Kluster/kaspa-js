<script lang="ts">
  import { cn } from "$lib/utils";

  let { class: className = undefined, children, ...rest } = $props();
</script>

<div class={cn("p-6 pt-0", className)} {...rest}>
  {@render children()}
</div>
