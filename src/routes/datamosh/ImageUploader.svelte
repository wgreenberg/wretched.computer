<script lang="ts" module>
    export interface ImageData {
        mimetype: string,
        data: ArrayBuffer,
    }
</script>

<script lang="ts">
    let { data = $bindable() }: {
        data: ImageData | undefined,
    } = $props();
    let err: string | undefined = $state(undefined);

    function handleImage(inputEvent: Event) {
        const reader = new FileReader();
        reader.onload = function(readerEvent) {
            if (readerEvent.target === null || readerEvent.target.result === null) {
                err = "target is null or ArrayBuffer";
                return;
            }
            if (readerEvent.target.result instanceof ArrayBuffer) {
                data = {
                    mimetype: 'binary',
                    data: readerEvent.target.result,
                };
                err = undefined;
            } else {
                if (!readerEvent.target.result.startsWith('data:image/')) {
                    err = "unexpected file contents"
                    return;
                }
                try {
                    const [mimePart, b64Part] = readerEvent.target.result.split(';base64,');
                    const mimetype = mimePart.split('data:')[1];
                    const decoded = Uint8Array.from(atob(b64Part), c => c.charCodeAt(0))
                    data = {
                        mimetype,
                        data: decoded.buffer,
                    };
                } catch(error) {
                    err = `err: ${error}`;
                }
                err = undefined;
            }
        };
        reader.readAsDataURL((inputEvent.target! as any).files[0]);
    }
</script>

<div>
    {#if err !== undefined}
        <div><pre>{err}</pre></div>
    {/if}
	<input type="file" onchange={handleImage} />
</div>
