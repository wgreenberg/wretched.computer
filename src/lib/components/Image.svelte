<script lang="ts">
    let { src, caption, alt }: {
        src: string,
        caption?: string,
        alt?: string,
    } = $props();
</script>

<figure class="flex flex-col items-center">
    <img {src} alt={alt ? alt : caption}>
    {#if caption !== undefined}
        <figcaption class="justify-center"><i>{caption}</i></figcaption>
    {/if}
</figure>
