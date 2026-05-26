<script lang="ts">
	import type { Block } from "./CmprDecoder.svelte";
	import { Canvas, Layer, type Render } from 'svelte-canvas';

    let { width, height, blocks, selectedBlock }: {
        width: number,
        height: number,
        blocks: Block[],
        selectedBlock: number,
    } = $props();
    const canvasDim = 256;

    const render: Render = ({ context: ctx, height: canvasHeight, width: canvasWidth, time }) => {
        ctx.imageSmoothingEnabled = false;

        let pixels = ctx.createImageData(width, height);
        let blockIdx = 0;
        let selectedBlockX = 0;
        let selectedBlockY = 0;
        for (let yy = 0; yy < height; yy += 8) {
            for (let xx = 0; xx < width; xx += 8) {
                for (let yb = 0; yb < 8; yb += 4) {
                    for (let xb = 0; xb < 8; xb += 4) {
                        let pxIdx = 0;
                        for (let y = 0; y < 4; y++) {
                            for (let x = 0; x < 4; x++) {
                                let dstPx = (yy + yb + y) * width + (xx + xb + x);
                                let dstPxOffset = dstPx * 4;
                                if (blockIdx > selectedBlock) {
                                    pixels.data[dstPxOffset] = 255;
                                    pixels.data[dstPxOffset+1] = 255;
                                    pixels.data[dstPxOffset+2] = 255;
                                    pixels.data[dstPxOffset+3] = 0;
                                    continue;
                                }
                                const block = blocks[blockIdx];
                                const color = block.colors[block.pixels[pxIdx]];
                                pixels.data[dstPxOffset] = color[0];
                                pixels.data[dstPxOffset+1] = color[1];
                                pixels.data[dstPxOffset+2] = color[2];
                                pixels.data[dstPxOffset+3] = 255;
                                pxIdx++;
                            }
                        }
                        if (blockIdx == selectedBlock) {
                            selectedBlockX = xx + xb;
                            selectedBlockY = yy + yb;
                        }
                        blockIdx++;
                    }
                }
            }
        }
        ctx.putImageData(pixels, 0, 0);
        ctx.scale(canvasDim / width, canvasDim / height);
        ctx.drawImage(ctx.canvas, 0, 0);
        ctx.scale(1, 1);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(selectedBlockX, selectedBlockY, 4, 4);
    };
</script>

<div class="border">
    <Canvas width={canvasDim} height={canvasDim}>
        <Layer {render} />
    </Canvas>
</div>
