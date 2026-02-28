<script lang="ts">
    import ImageUploader from "./ImageUploader.svelte";
    import type { ImageData } from "./ImageUploader.svelte";

    let uploadedImage: ImageData | undefined = $state(undefined);
    let imageHexString: string | undefined = $state(undefined);

    $effect(() => {
        if (uploadedImage) {
            console.log('ok')
            const buf = new Uint8Array(uploadedImage.data);
            let result = ''
            for (let i=0; i<buf.length; i++) {
                result += buf[i].toString(16);
                if (i % 16 == 0) {
                    result += '\n'
                }
            }
            imageHexString = result;
            console.log(result.length)
        }
    })
</script>

<main class="flex flex-row items-center">
    <div>
        <ImageUploader bind:data={uploadedImage} />
        <textarea spellcheck="false" autocomplete="off" autocapitalize="off" name="data" id="data">{imageHexString}</textarea>
    </div>
    <div>
        <!-- svelte-ignore a11y_missing_attribute -->
        <img src="" id="image">
    </div>
</main>c
