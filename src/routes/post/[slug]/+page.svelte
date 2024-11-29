<script lang="ts">
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

<main class="flex items-center flex-col">
    <article class="prose prose-green m-10 w-4/5">
        <div class="shadow-xl bg-slate-800 rounded-md p-2 w-full">
            <h1 class="text-center font-serif">{data.metadata.title}</h1>
            <h2 class="text-center font-serif">{dateToString(data.metadata.date)}</h2>
        </div>
        <div class="flex flex-col rounded-md bg-slate-700 shadow-md mt-5 p-5 w-full">
            {@render data.content()}
        </div>
    </article>
</main>

<style>
    :global(.frac-line) {
        border-color: --tw-prose-body;
    }

    :global(.math-display) {
        @apply bg-[--tw-prose-pre-bg] rounded-md p-1 overflow-auto shadow-md w-full;
    }

    :global(pre) {
        @apply overflow-auto w-full shadow-md;
    }

    :global(img) {
        @apply rounded-md shadow-md self-center;
    }
</style>
