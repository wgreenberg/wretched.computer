<script lang="ts">
	import { onMount } from "svelte";
	import ByteSpan from "../crazy-taxi/ByteSpan.svelte";
import type { FileData } from "../crazy-taxi/data";
	import CmprDecoderBody from "./CmprDecoderBody.svelte";
	import CmprDecoderImage from "./CmprDecoderImage.svelte";

    let { file, enableMips = false }: {
        file: FileData,
        enableMips: boolean,
    } = $props();
    let dataView = $derived(new DataView(new Uint8Array(file.data).buffer));
    let width = $derived(dataView.getUint32(0x0, false));
    let height = $derived(dataView.getUint32(0x4, false));
    let numBlocks = $derived(width * height / 16);
    let format = $derived(dataView.getUint32(0xc, false));
    let selectedBlock = $state(0);
    // onMount(() => {
    //     const selectedBlockElement = document.getElementById("cmpr-blocks")!.children[selectedBlock];
    //     selectedBlockElement.scrollIntoView();
    // });
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
        const byte = dataView.getUint8(n);
        let result = [];
        result.unshift(byte & 3);
        result.unshift((byte >> 2) & 3);
        result.unshift((byte >> 4) & 3);
        result.unshift((byte >> 6) & 3);
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

        let pixels = byteToPixelOffsets(offset + 4);
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

<div class="flex flex-col prose-sm bg-gray-600">
    <div class="flex flex-row border-dotted border rounded-t-lg p-1">
        <div id="cmpr-blocks" class="overflow-scroll max-h-64 px-1 flex flex-col bg-gray-700">
            {#each { length: numBlocks }, i}
            <button class="p-1 {selectedBlock == i ? "bg-green-950" : ""}" onclick={() => selectedBlock = i}>
                Block {i}
            </button>
            {/each}
        </div>
        <CmprDecoderBody block={blocks[selectedBlock]} />
    </div>
    <div class="border-dotted border rounded-b-lg p-1 border-t-0 flex flex-col items-center">
        <span>Result texture:</span>
        <CmprDecoderImage {width} {height} {blocks} {selectedBlock} />
    </div>
</div>
