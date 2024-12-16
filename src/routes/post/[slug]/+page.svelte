<script lang="ts">
    import MainBox from "$lib/components/MainBox.svelte";
    import TitleBox from "$lib/components/TitleBox.svelte";
    import CommentSection from "$lib/components/CommentSection.svelte";
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
</script>

<main class="flex justify-stretch items-center flex-col">
    <TitleBox>
        <h1 class="text-center font-serif">{data.metadata.title}</h1>
        <p>{data.metadata.description}</p>
        <h3 class="text-center font-serif">{dateToString(data.metadata.date)}</h3>
    </TitleBox>
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
