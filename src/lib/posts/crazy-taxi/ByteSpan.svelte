<script lang="ts">
	import HexCell from "./HexCell.svelte";

let { data }: {
    data: number[],
} = $props();
</script>

<span class="p-1 bg-gray-800">
    {#each data as byte}
        <HexCell data={byte} isHighlighted={false} />
    {/each}
</span>

<style>
</style>
