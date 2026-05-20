<script lang="ts">
	import ByteSpan from "../crazy-taxi/ByteSpan.svelte";
import type { FileData } from "../crazy-taxi/data";
	import CmprDecoderBody from "./CmprDecoderBody.svelte";

    let { file, enableMips = false }: {
        file: FileData,
        enableMips: boolean,
    } = $props();
    let dataView = $derived(new DataView(new Uint8Array(file.data).buffer));
    let width = $derived(dataView.getUint32(0x0, false));
    let height = $derived(dataView.getUint32(0x4, false));
    let numBlocks = $derived(width * height / 16);
    let format = $derived(dataView.getUint32(0xc, false));
    let selectedBlock: number | undefined = $state(undefined);
    $effect(() => {
        if (format !== 0xe) {
            throw new Error(`invalid format ${format}`);
        }
    });
    let numMips = $derived(dataView.getUint32(0x18, false));

    export interface Block {
        colors: [number, number, number][],
        pixels: number[],
        bytes: number[],
    }

    // http://www.mindcontrol.org/~hplus/graphics/expand-bits.html
    function expandNTo8(v: number, n: number): number {
        if (v === 3) {
            return (n << (8 - 3)) | (n << (8 - 6)) | (n >> (9 - 8));
        } else if (v >= 4) {
            return (n << (8 - v)) | (n >> ((v*2) - 8));
        } else {
            throw new Error(`invalid n: ${n}`)
        }
    }

    function rgb565ToRGB(p: number): [number, number, number] {
        return [
            expandNTo8(5, ((p >> 11) & 0x1F)),
            expandNTo8(6, ((p >>  5) & 0x3F)),
            expandNTo8(5, ((p >>  0) & 0x1F)),
        ];
    }

    function byteToPixelOffsets(n: number): number[] {
        let result = [];
        result.unshift(n & 3);
        result.unshift((n >> 2) & 3);
        result.unshift((n >> 4) & 3);
        result.unshift((n >> 6) & 3);
        return result;
    }

    function s3tcblend(a: number, b: number): number {
        // return (a*3 + b*5) / 8;
        return (((a << 1) + a) + ((b << 2) + b)) >> 3;
    }

    function halfblend(a: number, b: number): number {
        return (a + b) >> 1;
    }

    function getBlock(i: number): Block {
        const offset = 0x60 + i * 8;
        let colors: [number, number, number][] = [];
        let color0Raw = dataView.getUint16(offset, false);
        colors.push(rgb565ToRGB(color0Raw));
        let color1Raw = dataView.getUint16(offset + 2, false);
        colors.push(rgb565ToRGB(color1Raw));
        let pixels = byteToPixelOffsets(offset + 4);
        colors.push([0, 0, 0]);
        colors.push([0, 0, 0]);
        if (color0Raw > color1Raw) {
            colors[2] = [
                s3tcblend(colors[1][0], colors[0][0]),
                s3tcblend(colors[1][1], colors[0][1]),
                s3tcblend(colors[1][2], colors[0][2]),
            ];
            colors[3] = [
                s3tcblend(colors[0][0], colors[1][0]),
                s3tcblend(colors[0][1], colors[1][1]),
                s3tcblend(colors[0][2], colors[1][2]),
            ];
        } else {
            colors[2] = [
                halfblend(colors[0][0], colors[1][0]),
                halfblend(colors[0][1], colors[1][1]),
                halfblend(colors[0][2], colors[1][2]),
            ];
        }

        pixels = pixels.concat(byteToPixelOffsets(offset + 5));
        pixels = pixels.concat(byteToPixelOffsets(offset + 6));
        pixels = pixels.concat(byteToPixelOffsets(offset + 7));
        let bytes = getBlockBytes(i);
        return {
            colors,
            pixels,
            bytes,
        }
    }

    function getBlockBytes(i: number): number[] {
        const offset = 0x60 + i * 8;
        let result = [];
        for (let j=0; j < 8; j++) {
            result.push(dataView.getUint8(offset + j));
        }
        return result;
    }

    let blocks: Block[] = $derived.by(() => {
        let blocks = [];
        for (let i=0; i<numBlocks; i++) {
            blocks.push(getBlock(i));
        }
        return blocks;
    });
</script>

<div class="flex flex-row prose-sm w-full max-h-96">
    <div class="overflow-scroll px-1 flex flex-col">
        {#each { length: numBlocks }, i}
        <div class="p-1 {selectedBlock == i ? "bg-red-800" : ""}">
            <button onclick={() => selectedBlock = i}>
                Block {i}
            </button>
        </div>
        {/each}
    </div>
    <div>
        {#if selectedBlock === undefined}
            <span>Select a block</span>
        {:else}
            <CmprDecoderBody block={blocks[selectedBlock]} />
        {/if}
    </div>
</div>
