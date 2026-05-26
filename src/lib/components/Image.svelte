<script lang="ts">
    let { src, srcs, caption, alt }: {
        src?: string,
        srcs?: string[],
        caption?: string,
        alt?: string,
    } = $props();
    const imgClass = "rounded-md shadow-md self-center";
</script>

<figure class="flex flex-col items-center">
    {#if src !== undefined}
        <img class="{imgClass}" {src} alt={alt ? alt : caption}>
    {:else}
        <div class="flex flex-row flex-wrap">
            {#each srcs as src}
                <img class="mt-0.5 mb-0.5 {imgClass}" {src} alt={alt ? alt : caption}>
            {/each}
        </div>
    {/if}
    {#if caption !== undefined}
        <figcaption class="justify-center"><i>{caption}</i></figcaption>
    {/if}
</figure>
