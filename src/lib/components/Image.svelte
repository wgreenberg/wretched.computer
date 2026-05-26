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
        <div class="flex flex-row">
            {#each srcs as src}
                <img {src} alt={alt ? alt : caption}>
            {/each}
        </div>
    {/if}
    {#if caption !== undefined}
        <figcaption class="justify-center"><i>{caption}</i></figcaption>
    {/if}
</figure>
