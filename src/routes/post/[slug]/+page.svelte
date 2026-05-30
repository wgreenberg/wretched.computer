<script lang="ts">
    import MainBox from "$lib/components/MainBox.svelte";
	import PostMetaTags from "$lib/components/PostMetaTags.svelte";
	import TableOfContents from "$lib/components/TableOfContents.svelte";
    import TitleBox from "$lib/components/TitleBox.svelte";
	import UnderConstruction from "$lib/components/UnderConstruction.svelte";
    import type { PageData } from "./$types";
    let { data }: { data: PageData } = $props();
</script>

<svelte:head>
    <title>{data.metadata.title}</title>
</svelte:head>
<PostMetaTags post={data.metadata} />
<main class="flex flex-col items-center justify-stretch mb-20">
    <TitleBox bottomBorder={!data.metadata.toc}>
        <p class="text-sm font-serif">{data.metadata.date}</p>
        <h2 class="mt-0 text-center font-serif">{data.metadata.title}</h2>
        <h4 class="text-center italic w-4/5">{data.metadata.description}</h4>
    </TitleBox>
    {#if data.metadata.toc}
        <TableOfContents headings={data.headings} />
    {/if}
    {#if !data.metadata.published}
        <UnderConstruction />
    {/if}
    <MainBox>
        {@render data.content()}
    </MainBox>
</main>
