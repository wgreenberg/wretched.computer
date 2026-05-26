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
            .map(c => c.length === 1 ? '0' + c : c)
            .reduce((x, a) => x + a, '');
    }
    let bitstring = $derived(getBitstring(block.bytes))
</script>

{#snippet color(name: string, offset: number | undefined, color: [number, number, number])}
    {@const hexcode = getHexCode(color)}
    <tr>
        <td>{name}</td>
        {#if offset !== undefined}
            <td class="">
                <span class="font-mono bg-red-500">{bitstring.slice(offset + 0, offset + 5)}</span>
                <span class="font-mono bg-green-500">{bitstring.slice(offset + 5, offset + 11)}</span>
                <span class="font-mono bg-blue-500">{bitstring.slice(offset + 11, offset + 16)}</span>
            </td>
        {:else}
            <td class="">blend(color0, color1)</td>
        {/if}
        <td class="">
            <div class="font-mono w-fit" style="background-color: {hexcode}">
                <span style="color: contrast-color({hexcode})">{hexcode}</span>
            </div>
        </td>
    </tr>
{/snippet}

{#snippet pixel(i: number)}
    {@const hexcode = getHexCode(block.colors[block.pixels[i]])}
    {@const pixelBitstring = block.pixels[i].toString(2)}
    {@const padding = pixelBitstring.length < 2 ? '0' : ''}
    <div class="font-mono px-1" style="background-color: {hexcode}">
        <span style="color: contrast-color({hexcode})">{padding + pixelBitstring}</span>
    </div>
{/snippet}

<div class="flex flex-col m-3">
    <div>
        <span>Bytes:</span>
        <ByteSpan data={block.bytes} />
    </div>
    <table class="table-auto">
        <thead>
            <tr>
                <th>Color</th>
                <th>Source</th>
                <th>Result</th>
            </tr>
        </thead>
        <tbody>
            {@render color("0", 0, block.colors[0])}
            {@render color("1", 16, block.colors[1])}
            {@render color("2", undefined, block.colors[2])}
            {@render color("3", undefined, block.colors[3])}
        </tbody>
    </table>
    <div class="flex flex-col">
        <div>Pixels:</div>
        <div class="grid grid-cols-4 w-fit border-dashed border">
            {#each { length: 16 }, i}
                {@render pixel(i)}
            {/each}
        </div>
    </div>
</div>
