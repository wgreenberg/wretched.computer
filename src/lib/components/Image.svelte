<script lang="ts">
    let { src, srcs, caption, alt }: {
        src?: string,
        srcs?: string[],
        caption?: string,
        alt?: string,
    } = $props();
</script>

<figure class="flex flex-col items-center">
    {#if src !== undefined}
        <img {src} alt={alt ? alt : caption}>
    {:else}
        <div class="flex flex-row flex-wrap">
            {#each srcs as src}
                <img class="mt-0.5 mb-0.5" {src} alt={alt ? alt : caption}>
            {/each}
        </div>
    {/if}
    {#if caption !== undefined}
        <figcaption class="justify-center"><i>{caption}</i></figcaption>
    {/if}
</figure>
