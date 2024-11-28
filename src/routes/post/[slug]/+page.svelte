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
        <div class="shadow-xl">
            <h1 class="text-center font-serif">{data.metadata.title}</h1>
            <h2 class="text-center font-serif">{dateToString(data.metadata.date)}</h2>
        </div>
        <div class="flex flex-col items-center justify-center shadow-xl p-5">
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
</style>
