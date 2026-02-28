<script lang="ts">
import DataPane from "./DataPane.svelte";
import HexCell from "./HexCell.svelte";
import { type FileData } from "./data";

let { file, littleEndian = true }: {
    file: FileData,
    littleEndian?: boolean,
} = $props();

let innerWidth = $state(500);
let remainingBytes = $derived(file.totalLength - (file.startOffset + file.data.length));
let nCols = $derived(innerWidth < 500 ? 8 : 16);
let nRows = $derived(Math.ceil(file.data.length / nCols));
let highlightStart: number = $state(Infinity);
let highlightEnd: number = $state(-Infinity);
let bytes = $derived(new Uint8Array(file.data));
let dataView = $derived(new DataView(bytes.buffer));

function selectCell(i: number) {
    if (i + 4 >= file.data.length) {
        i = file.data.length - 4;
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

<div class="font-mono flex flex-col prose-sm">
    <div class="bg-gray-900 w-fit pl-1 pr-1 rounded-t-lg">
        <span>{file.title}</span>
    </div>
    <div class="flex flex-row justify-evenly overflow-auto max-h-96 bg-gray-600 p-1 border border-dotted rounded-tr-lg">
        <div class="pl-1 pr-1">
            <div>
                <span>Offset</span>
            </div>
            <div class="flex flex-col">
                {#each { length: nRows }, row}
                    {@const addr = row * nCols + file.startOffset}
                    <span>{zeroPadHex(addr, 8)}</span>
                {/each}
                {#if remainingBytes > 0}
                    <span class="text-center">⋮</span>
                    <span>{zeroPadHex(file.totalLength, 8)}</span>
                {/if}
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
                        {@const cellData = file.data[i]}
                        {#if cellData !== undefined}
                            {@const buttonClass = col % 4 === 0 && col > 0 ? 'border-l border-gray-400 border-dashed' : ''}
                            <button class={buttonClass} onclick={() => selectCell(i)}>
                                <HexCell
                                    data={file.data[i]}
                                    isHighlighted={isIndexHighlighted(i)}
                                    />
                            </button>
                        {/if}
                    {/each}
                    </div>
                {/each}
                {#if remainingBytes > 0}
                    <div class="w-full text-center">0x{remainingBytes.toString(16)} hidden</div>
                    <div class="w-full text-center bg-gray-800">(end of file)</div>
                {/if}
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
                        {@const cellData = file.data[i]}
                        {@const color = isIndexHighlighted(i) ? 'bg-red-800' : ''}
                        {@const char = getASCII(file.data[i])}
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
                {#if remainingBytes > 0}
                    <div class="w-full text-center">⋮</div>
                    <div class="w-full text-center bg-gray-800">-</div>
                {/if}
            </div>
        </div>
    </div>
    <div class="bg-gray-600 p-2 border border-dotted border-t-0 rounded-b-lg">
        <span>Data Inspector:</span>
        <DataPane data={dataView} index={highlightStart === Infinity ? undefined : highlightStart} {littleEndian} />
    </div>
</div>

<style>
</style>
