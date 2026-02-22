<script lang="ts">
	import HexCell from "./HexCell.svelte";

let { data }: {
    data: number[],
} = $props();
</script>

<span class="pt-1 pb-1 pl-0.5 pr-0.5 bg-gray-800">
    {#each data as byte}
        <HexCell data={byte} isHighlighted={false} />
    {/each}
</span>

<style>
</style>
