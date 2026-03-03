<script lang="ts">
    import { vec3 } from 'gl-matrix';

    let {
        points,
        normals,
        tris,
        selectedPoints = $bindable(),
        selectedNormals = $bindable(),
        selectedTris = $bindable(),
    }: {
        points: vec3[],
        normals: vec3[],
        tris: [number, number][][],
        selectedPoints: number[],
        selectedNormals: number[],
        selectedTris: number[],
    } = $props();

    function selectPoint(i: number | null) {
        selectedPoints = i === null ? [] : [i];
        selectedNormals = [];
        selectedTris = [];
    }

    function selectNormal(i: number | null) {
        selectedNormals = i === null ? [] : [i];
        selectedPoints = [];
        selectedTris = [];
    }

    function selectTri(i: number | null) {
        selectedTris = i === null ? [] : [i];
        selectedPoints = [];
        selectedNormals = [];
        if (i === null) return;
        for (const [point, normal] of tris[i]) {
            selectedPoints.push(point - 1);
            selectedNormals.push(normal - 1);
        }
    }
    const codeLineClass = "m-0 pl-1 pr-1 rounded-md";
    const codeLineHover = "bg-green-900"
</script>

<div class="code font-mono text-sm flex flex-col items-start max-h-72">
    <p class={codeLineClass}>g cube</p>
    <br>
    <div class="flex flex-col items-start">
        {#each points as p, i}
            {@const text = `v ${p[0].toPrecision(2)} ${p[1].toPrecision(2)} ${p[2].toPrecision(2)}`}
            {@const color = selectedPoints.includes(i) ? codeLineHover : ""}
            <button
                class={`${color} ${codeLineClass}`}
                onmouseenter={() => selectPoint(i)}
                onmouseleave={() => selectPoint(null)}
            >
                {text}
            </button>
        {/each}
    </div>
    <br>
    <div class="flex flex-col items-start">
        {#each normals as n, i}
            {@const text=`vn ${n[0].toPrecision(2)} ${n[1].toPrecision(2)} ${n[2].toPrecision(2)}`}
            {@const color = selectedNormals.includes(i) ? codeLineHover : ""}
            <button
                class={`${color} ${codeLineClass}`}
                onmouseenter={() => selectNormal(i)}
                onmouseleave={() => selectNormal(null)}
            >
                {text}
            </button>
        {/each}
    </div>
    <br>
    <div class="flex flex-col items-start">
        {#each tris as t, i}
            {@const text=`f ${t[0][0]}//${t[0][1]} ${t[1][0]}//${t[1][1]} ${t[2][0]}//${t[2][1]}`}
            {@const color = selectedTris.includes(i) ? codeLineHover : ""}
            <button
                class={`${color} ${codeLineClass}`}
                onmouseenter={() => selectTri(i)}
                onmouseleave={() => selectTri(null)}
            >
                {text}
            </button>
        {/each}
    </div>
</div>

<style>
    .code {
        background: #002b36;
        color: #839496;
        white-space: pre;
        padding: 1em;
        overflow: auto;
        border-radius: 0.3em;
    }
</style>
