<script lang="ts">
    import MainBox from "$lib/components/MainBox.svelte";
	import TableOfContents from "$lib/components/TableOfContents.svelte";
    import TitleBox from "$lib/components/TitleBox.svelte";
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
</script>

<main class="flex flex-col items-center justify-stretch mb-20">
    <TitleBox bottomBorder={!hasToc}>
        <p class="text-sm font-serif m-1">{dateToString(data.metadata.date)}</p>
        <h2 class="text-center font-serif m-1">{data.metadata.title}</h2>
        <h4 class="m-1 text-center italic w-4/5">{data.metadata.description}</h4>
    </TitleBox>
    {#if hasToc}
        <TableOfContents headings={data.headings} />
    {/if}
    <MainBox>
        {@render data.content()}
    </MainBox>
</main>

<style>
    :global(.frac-line) {
        border-color: --tw-prose-body;
    }

    :global(.math-display) {
        @apply bg-[--tw-prose-pre-bg] rounded-md p-1 m-0 overflow-auto shadow-md w-full;
    }

    :global(pre) {
        @apply overflow-auto w-full shadow-md;
    }

    :global(img) {
        @apply rounded-md shadow-md self-center;
    }
</style>
