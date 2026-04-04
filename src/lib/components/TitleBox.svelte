<script lang="ts">
	import type { Snippet } from "svelte";

    let {
        bottomBorder = true,
        children,
    }: {
        bottomBorder: boolean,
        children: Snippet,
    } = $props();
    let baseClasses = "prose prose-green flex flex-col items-center border border-dashed rounded-lg border-slate-400 border-b w-full shadow-s md:p-5 p-1 ml-1 mr-1 p-0";
    let borderClasses = $derived(bottomBorder ? "" : "border-b-0 rounded-b-none md:pb-0")
</script>

<article class="{baseClasses} {borderClasses}">
    {@render children()}
</article>
