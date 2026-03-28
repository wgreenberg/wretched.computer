<script lang="ts">
    import { vec3, mat4, vec4, vec2, mat3 }from 'gl-matrix';
	import { Canvas, Layer, type Render } from 'svelte-canvas';

    let { height, width, camera, target, points, normals, tris, selectedNormals, selectedPoints, selectedTris }: {
        height: number,
        width: number,
        camera: [number, number, number],
        target: [number, number, number],
        points: vec3[],
        normals: vec3[],
        tris: [number, number][][],
        selectedPoints: number[],
        selectedNormals: number[],
        selectedTris: number[],
    } = $props();

    const fov = Math.PI / 4;
    const up = vec3.fromValues(0, -1, 0);
    const light = vec3.create();
    const lightColor = vec3.fromValues(1, 1, 1);
    let wireframeMode = $derived(
        selectedPoints.length > 0 || selectedTris.length > 0
    );

    const scratchVec4 = vec4.create();
    const scratchVec3A = vec3.create();
    const scratchVec3B = vec3.create();
    const scratchVec3C = vec3.create();
    const scratchVec3D = vec3.create();
    const scratchVec3E = vec3.create();
    const scratchMat4A = mat4.create();
    const scratchMat4B = mat4.create();
    const scratchMat4C = mat4.create();
    const scratchMat4D = mat4.create();

    function drawAxis(
        ctx: CanvasRenderingContext2D,
        viewportFromView: mat4,
        clipFromView: mat4,
        origin: vec3,
        scale: number,
    ) {
        drawWorldSpaceArrow(ctx, viewportFromView, clipFromView, origin, [0, 0, scale], 'z', 1, 'green');
        drawWorldSpaceArrow(ctx, viewportFromView, clipFromView, origin, [scale, 0, 0], 'x', 1, 'red');
        drawWorldSpaceArrow(ctx, viewportFromView, clipFromView, origin, [0, scale, 0], 'y', 1, 'blue');
    }

    function drawWorldSpaceArrow(
        ctx: CanvasRenderingContext2D,
        viewFromModel: mat4,
        viewportFromView: mat4,
        start: vec3,
        endDir: vec3,
        label?: string,
        lineWidth: number = 1,
        color: string = 'black',
        scale: number = 1,
    ) {
        let startView = vec3.transformMat4(scratchVec3A, start, viewFromModel);
        let startClip = vec3.transformMat4(scratchVec3A, startView, viewportFromView);
        let end = vec3.scaleAndAdd(scratchVec3B, start, endDir, scale);
        let endView = vec3.transformMat4(scratchVec3B, end, viewFromModel);
        let endClip = vec3.transformMat4(scratchVec3B, endView, viewportFromView);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(startClip[0], startClip[1]);
        ctx.lineTo(endClip[0], endClip[1]);
        ctx.closePath();
        ctx.stroke();

        let dir = vec2.sub(vec2.create(), endClip, startClip);
        vec2.normalize(dir, dir);
        let perp = vec2.rotate(vec2.create(), dir, [0, 0], Math.PI/2);
        vec2.scale(perp, perp, 5);
        let a = vec2.add(vec2.create(), endClip, perp);
        let b = vec2.scaleAndAdd(vec2.create(), endClip, perp, -1);
        vec2.rotate(perp, perp, [0, 0], -Math.PI/2);
        let c = vec2.add(perp, endClip, perp);
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.lineTo(c[0], c[1]);
        ctx.lineTo(a[0], a[1]);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();

        if (label) {
            let textCoord = vec2.scaleAndAdd(vec2.create(), perp, dir, 10);
            ctx.fillText(label, textCoord[0], textCoord[1]);
        }
    }

    const render: Render = ({ context: ctx, height, width }) => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        vec3.scale(light, camera, 3);

        const viewFromModel = mat4.lookAt(scratchMat4A, camera, target, up);
        const normViewFromModel = mat4.invert(scratchMat4B, viewFromModel);
        if (normViewFromModel === null) {
            throw new Error("uninvertable");
        }
        mat4.transpose(normViewFromModel, normViewFromModel);

        const clipFromView = mat4.perspective(scratchMat4C, fov, width/height, 0.1, Infinity);

        // setup viewport transform
        const viewportFromClip = mat4.identity(scratchMat4D);
        viewportFromClip[0] = width/2;
        viewportFromClip[5] = height/2;
        viewportFromClip[12] = width/2;
        viewportFromClip[13] = height/2;
        const viewportFromView = mat4.mul(scratchMat4D, viewportFromClip, clipFromView);

        drawAxis(ctx, viewFromModel, viewportFromView, [-0.1, -0.1, -0.1], 1);

        ctx.fillStyle = 'black';
        const viewPoints: vec3[] = [];
        for (const point of points) {
            const vert = vec3.transformMat4(vec3.create(), point, viewFromModel);
            viewPoints.push(vert);
        }

        if (selectedNormals.length > 0 && selectedTris.length === 0) {
            for (const i of selectedNormals) {
                drawWorldSpaceArrow(
                    ctx,
                    viewFromModel,
                    viewportFromView,
                    [-0.1, -0.1, -0.1],
                    normals[i],
                    undefined,
                    5,
                    'green',
                    0.5,
                );
            }
        }

        for (let i=0; i<tris.length; i++) {
            if (selectedNormals.length > 0 && selectedPoints.length === 0 && selectedTris.length === 0) continue;
            const [[vi0, ni0], [vi1, ni1], [vi2, ni2]] = tris[i];
            const v0 = vec3.transformMat4(scratchVec3A, viewPoints[vi0 - 1], viewportFromView);
            const v1 = vec3.transformMat4(scratchVec3B, viewPoints[vi1 - 1], viewportFromView);
            const v2 = vec3.transformMat4(scratchVec3C, viewPoints[vi2 - 1], viewportFromView);
            let lineOfSight = vec3.sub(scratchVec3D, points[vi0 - 1], camera);
            const isBackface = vec3.dot(lineOfSight, normals[ni0 - 1]) > 0;
            const triSelected = selectedTris.includes(i);
            let stroke = false;
            let fill = false;

            ctx.beginPath();
            ctx.moveTo(v0[0], v0[1]);
            ctx.lineTo(v1[0], v1[1]);
            ctx.lineTo(v2[0], v2[1]);
            ctx.lineTo(v0[0], v0[1]);
            ctx.closePath();

            if (triSelected) {
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 3;
                stroke = true;
                ctx.fillStyle = 'DarkGreen';
                fill = true;
            } else if (wireframeMode) {
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 1;
                stroke = true;
            } else if (!isBackface) {
                const lightDir = vec3.sub(scratchVec3D, points[vi0 - 1], light);
                vec3.normalize(lightDir, lightDir);
                vec3.scale(lightDir, lightDir, -1);
                const lighting = 255 * vec3.dot(normals[ni0 - 1], lightDir);
                const lightResult = vec3.scale(vec3.create(), lightColor, lighting);
                ctx.fillStyle = `rgba(${lightResult[0]}, ${lightResult[1]}, ${lightResult[2]}, 100%)`;
                fill = true;
            }

            if (stroke) {
                ctx.stroke();
            }

            if (fill) {
                ctx.fill();
            }

            for (const [vi, ni] of [[vi0, ni0], [vi1, ni1], [vi2, ni2]]) {
                if (!selectedNormals.includes(ni - 1)) continue;
                if (selectedTris.length > 0 && !triSelected) continue;
                drawWorldSpaceArrow(
                    ctx,
                    viewFromModel,
                    viewportFromView,
                    points[vi - 1],
                    normals[ni - 1],
                    undefined,
                    3,
                    'green',
                    0.3,
                );
            }
        }

        for (let i=0; i<viewPoints.length; i++) {
            if (!wireframeMode) continue;
            const vert = viewPoints[i];
            let maxSize;
            if (selectedPoints.includes(i)) {
                maxSize = 50;
                ctx.strokeStyle = 'green'
            } else {
                maxSize = 10;
                ctx.strokeStyle = 'black'
            }
            const size = maxSize/vert[2];
            const v = vec3.transformMat4(scratchVec3A, vert, viewportFromView);
            ctx.fillRect(v[0] - size/2, v[1] - size/2, size, size);
        }
    };
</script>

<Canvas class="max-md:rounded-b-md md:rounded-r-md" {width} {height}>
    <Layer {render} />
</Canvas>
