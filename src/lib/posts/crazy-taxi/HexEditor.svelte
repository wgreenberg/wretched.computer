<script lang="ts">
import DataPane from "./DataPane.svelte";
import HexCell from "./HexCell.svelte";

let { title, data, addrOffset, littleEndian }: {
    title: string,
    data: number[],
    addrOffset?: number,
    littleEndian?: boolean,
} = $props();

if (littleEndian === undefined) {
    littleEndian = true;
}
let innerWidth = $state(0);
let nCols = $derived(innerWidth < 500 ? 8 : 16);
if (addrOffset === undefined) {
    addrOffset = 0;
}
let nRows = $derived(Math.ceil(data.length / nCols));
let highlightStart: number = $state(Infinity);
let highlightEnd: number = $state(-Infinity);
let bytes = $derived(new Uint8Array(data));
let dataView = $derived(new DataView(bytes.buffer));

function selectCell(i: number) {
    if (i + 4 >= data.length) {
        i = data.length - 4;
    }
    highlightStart = i;
    highlightEnd = i + 4;
}

function isIndexHighlighted(i: number): boolean {
    return i >= highlightStart && i < highlightEnd;
}

function getASCII(value: number): string | undefined {
    if (value >= 33 && value <= 126) {
        return String.fromCharCode(value);
    }
    return undefined;
}

function zeroPadHex(n: number, pad: number): string {
    let nStr = n.toString(16);
    while (nStr.length < pad) {
        nStr = `0${nStr}`;
    }
    return nStr;
}
</script>

<svelte:window bind:innerWidth />

<div class="font-mono flex flex-col prose-sm w-full">
    <div class="bg-gray-900 w-fit pl-1 pr-1 rounded-t-lg">
        <span>{title}</span>
    </div>
    <div class="flex flex-row overflow-auto w-full max-h-96 bg-gray-600">
        <div class="pl-1 pr-1">
            <div>
                <span>Offset</span>
            </div>
            <div class="flex flex-col">
                {#each { length: nRows }, row}
                    {@const addr = row * nCols + addrOffset}
                    <span>{zeroPadHex(addr, 8)}</span>
                {/each}
            </div>
        </div>
        <div class="pr-1 bg-gray-600">
            <div class="bg-gray-600 pl-1">
                <span>Bytes</span>
            </div>
            <div>
                {#each { length: nRows }, row}
                    {@const color = row % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}
                    {@const rowClass = `flex flex-row ${color}`}
                    <div class={rowClass}>
                    {#each { length: nCols }, col}
                        {@const i = row * nCols + col}
                        {@const cellData = data[i]}
                        {#if cellData !== undefined}
                            {@const buttonClass = col % 4 === 0 && col > 0 ? 'border-l border-gray-400 border-dashed' : ''}
                            <button class={buttonClass} onclick={() => selectCell(i)}>
                                <HexCell
                                    data={data[i]}
                                    isHighlighted={isIndexHighlighted(i)}
                                    />
                            </button>
                        {/if}
                    {/each}
                    </div>
                {/each}
            </div>
        </div>
        <div class="mr-3">
            <div class="bg-gray-600 pl-1">
                <span>ASCII</span>
            </div>
            <div>
                {#each { length: nRows }, row}
                    {@const color = row % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}
                    {@const rowClass = `flex flex-row ${color}`}
                    <div class={rowClass}>
                    {#each { length: nCols }, col}
                        {@const i = row * nCols + col}
                        {@const cellData = data[i]}
                        {@const color = isIndexHighlighted(i) ? 'bg-red-800' : ''}
                        {@const char = getASCII(data[i])}
                        {@const textColor = char === undefined ? 'text-gray-400' : 'text-white'}
                        {@const spanClass = `${color} ${textColor}`}
                        {#if cellData !== undefined}
                            <button onclick={() => selectCell(i)}>
                                <span class={spanClass}>{char === undefined ? '.' : char}</span>
                            </button>
                        {/if}
                    {/each}
                    </div>
                {/each}
            </div>
        </div>
    </div>
    <div class="bg-gray-600 pl-1 w-full">
        <div>
            <span>Data Inspector</span>
        </div>
        <DataPane data={dataView} index={highlightStart === Infinity ? undefined : highlightStart} {littleEndian} />
    </div>
</div>

<style>
</style>
