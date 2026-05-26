<script lang="ts">
    import MainBox from "$lib/components/MainBox.svelte";
	import TableOfContents from "$lib/components/TableOfContents.svelte";
    import TitleBox from "$lib/components/TitleBox.svelte";
	import UnderConstruction from "$lib/components/UnderConstruction.svelte";
    import type { PageData } from "./$types";
    let { data }: { data: PageData } = $props();

    function dateToString(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleString('en-us', {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }
    let hasToc = $derived(!!data.metadata.toc);
    let published: boolean = $derived(!!data.metadata.published)
</script>

<title>{data.metadata.title}</title>
<main class="flex flex-col items-center justify-stretch mb-20">
    <TitleBox bottomBorder={!hasToc}>
        <p class="text-sm font-serif">{dateToString(data.metadata.date)}</p>
        <h2 class="mt-0 text-center font-serif">{data.metadata.title}</h2>
        <h4 class="text-center italic w-4/5">{data.metadata.description}</h4>
    </TitleBox>
    {#if hasToc}
        <TableOfContents headings={data.headings} />
    {/if}
    {#if !published}
        <UnderConstruction />
    {/if}
    <MainBox>
        {@render data.content()}
    </MainBox>
</main>
