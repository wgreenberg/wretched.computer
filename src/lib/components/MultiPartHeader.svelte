<script lang="ts">
	import type { Snippet } from "svelte";

    export interface Part {
        title: string,
        url: string,
    }
    let { parts, currentPart, children }: {
        parts: Part[],
        currentPart: number,
        children: Snippet,
    } = $props();
</script>

<div class="border border-double bg-slate-700 rounded-md font-light pl-3 pr-3 m-4 md:ml-10 md:mr-10">
    <i>{@render children()}</i>
    <ul>
        {#each parts as part, i}
            {#if i == currentPart}
                <li><b>{part.title}</b> (you are here)</li>
            {:else}
                <li><a href="{part.url}">{part.title}</a></li>
            {/if}
        {/each}
    </ul>
</div>
