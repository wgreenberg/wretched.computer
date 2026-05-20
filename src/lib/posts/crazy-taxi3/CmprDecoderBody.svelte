<script lang="ts">
	import ByteSpan from "../crazy-taxi/ByteSpan.svelte";
	import type { Block } from "./CmprDecoder.svelte";

    let { block }: { block: Block } = $props();

    function getBitstring(data: number[]): string {
        let result = '';
        for (const byte of data) {
            result += byte.toString(2);
        }
        return result;
    }
    function getHexCode(color: [number, number, number]): string {
        return '#' + color.map(c => c.toString(16))
            .reduce((x, a) => x + a, '');
    }
    let bitstring = $derived(getBitstring(block.bytes))
</script>

{#snippet color(name: string, offset: number | undefined, color: [number, number, number])}
    {@const hexcode = getHexCode(color)}
    <div class="flex flex-row">
        <span class="mr-1">{name}:</span>
        {#if offset !== undefined}
            <span class="font-mono bg-red-500">{bitstring.slice(offset + 0, offset + 5)}</span>
            <span class="font-mono bg-green-500">{bitstring.slice(offset + 5, offset + 11)}</span>
            <span class="font-mono bg-blue-500">{bitstring.slice(offset + 11, offset + 16)}</span>
            <span class="mx-1">=</span>
        {/if}
        <div class="font-mono" style="background-color: {hexcode}">
            <span class="text-white text-shadow-black text-shadow-lg">{hexcode}</span>
        </div>
    </div>
{/snippet}

{#snippet pixel(i: number)}
    {@const hexcode = getHexCode(block.colors[block.pixels[i]])}
    {@const pixelBitstring = block.pixels[i].toString(2)}
    {@const padding = pixelBitstring.length < 2 ? '0' : ''}
    <div class="font-mono px-1" style="background-color: {hexcode}">
        <span class="text-white text-shadow-black text-shadow-lg">{padding + pixelBitstring}</span>
    </div>
{/snippet}

<div class="flex flex-col">
    <div>
        <span>Data:</span>
        <ByteSpan data={block.bytes} />
    </div>
    <div>
        {@render color("color0", 0, block.colors[0])}
        {@render color("color1", 16, block.colors[1])}
        {@render color("Gradient color2", undefined, block.colors[2])}
        {@render color("Gradient color3", undefined, block.colors[3])}
    </div>
    <div>Pixels:</div>
    <div class="grid grid-cols-4 w-fit border-dashed border">
        {#each { length: 16 }, i}
            {@render pixel(i)}
        {/each}
    </div>
</div>
