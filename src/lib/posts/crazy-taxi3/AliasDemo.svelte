<script lang="ts">
	import { onMount } from "svelte";
	import { Canvas, Layer, type Render } from "svelte-canvas";

    let { imgUrl, minScale, maxScale }: {
        imgUrl: string,
        minScale: number,
        maxScale: number,
    } = $props();

    let loaded = $state(false);
    let img: HTMLImageElement | undefined = $state(undefined);
    let width = 300;
    let height = 300;
    let scale = $derived((maxScale - minScale) / 2)
    onMount(() => {
        img = new Image;
        img.onload = function () {
            console.log('ok')
            loaded = true;
        }
        img.src = imgUrl;
    })

    const render: Render = ({ context: ctx, height: canvasHeight, width: canvasWidth, time }) => {
        ctx.scale(1, 1)
        ctx.fillStyle = 'white';
        ctx.imageSmoothingEnabled = false;
        ctx.fillRect(0, 0, canvasHeight, canvasWidth);
        if (!loaded || !img) return;
        ctx.scale(scale, scale);
        for (let x=0; x < 2; x++) {
            for (let y=0; y<2; y++) {
                ctx.drawImage(img, x*img.width, y*img.width);
            }
        }
        // ctx.scale(1/(scale * scale), 1/(scale * scale));
        // ctx.drawImage(ctx.canvas, 0, 0)
    };
</script>

<div>
    <Canvas {width} {height} >
        <Layer {render} />
    </Canvas>
    <input type="range" min={0.1} max={maxScale} bind:value={scale} step={0.01}>
</div>
