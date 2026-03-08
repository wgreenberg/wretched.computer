<script lang="ts">
    import { vec3 } from 'gl-matrix';
	import Rasterizer from './Rasterizer.svelte';
	import { onDestroy, onMount } from 'svelte';
	import ObjText from './ObjText.svelte';

	let height = 300;
	let width = 300;

	let camera: [number, number, number] = $state([4, 2.4, 0]);
	let points = [
        vec3.fromValues(0.0, 0.0, 0.0),
        vec3.fromValues(0.0, 0.0, 1.0),
        vec3.fromValues(0.0, 1.0, 0.0),
        vec3.fromValues(0.0, 1.0, 1.0),
        vec3.fromValues(1.0, 0.0, 0.0),
        vec3.fromValues(1.0, 0.0, 1.0),
        vec3.fromValues(1.0, 1.0, 0.0),
        vec3.fromValues(1.0, 1.0, 1.0),
	];
	let normals = [
        vec3.fromValues(0.0, 0.0, 1.0),
        vec3.fromValues(0.0, 0.0, -1.0),
        vec3.fromValues(0.0, 1.0, 0.0),
        vec3.fromValues(0.0, -1.0,0.0),
        vec3.fromValues(1.0, 0.0, 0.0),
        vec3.fromValues(-1.0, 0.0, 0.0),
	];
	let tris: [number, number][][] = [
        [[1, 2], [7, 2], [5, 2]],
        [[1, 2], [3, 2], [7, 2]],
        [[1, 6], [4, 6], [3, 6]],
        [[1, 6], [2, 6], [4, 6]],
        [[3, 3], [8, 3], [7, 3]],
        [[3, 3], [4, 3], [8, 3]],
        [[5, 5], [7, 5], [8, 5]],
        [[5, 5], [8, 5], [6, 5]],
        [[1, 4], [5, 4], [6, 4]],
        [[1, 4], [6, 4], [2, 4]],
        [[2, 1], [6, 1], [8, 1]],
        [[2, 1], [8, 1], [4, 1]],
	];
	let animationId: number | null = $state(null);
	let target: [number, number, number] = $state([0.5, 0.5, 0.5]);
	let scratchVec3 = vec3.create();
	let cameraRotRadsPerSecond = Math.PI / 16;
	let lastTs: number | null = null;

    let selectedPoints: number[] = $state([]);
    let selectedNormals : number[] = $state([]);
    let selectedTris: number[] = $state([]);

	function animate(ts: number) {
    	let rotationRads = 0;
    	if (lastTs !== null) {
            let dt = ts - lastTs;
            rotationRads = cameraRotRadsPerSecond * dt / 1000.0;
        }
        vec3.set(scratchVec3, camera[0], camera[1], camera[2]);
        vec3.rotateY(scratchVec3, scratchVec3, target, rotationRads)
        camera = [scratchVec3[0], scratchVec3[1], scratchVec3[2]];
        lastTs = ts;
        animationId = requestAnimationFrame(animate);
	}

	onMount(() => {
        animationId = requestAnimationFrame(animate);
	});

	onDestroy(() => {
    	if (animationId !== null) {
           	cancelAnimationFrame(animationId);
    	}
	})
</script>

<div class="flex flex-col w-fit">
    <ObjText
        {points}
        {tris}
        {normals}
        bind:selectedNormals={selectedNormals}
        bind:selectedPoints={selectedPoints}
        bind:selectedTris={selectedTris}
    />
    <Rasterizer
        {width}
        {height}
        {selectedNormals}
        {selectedPoints}
        {selectedTris}
        {camera}
        {points}
        {tris}
        {normals}
        {target}
    />
</div>
