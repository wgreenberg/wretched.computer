<script lang="ts">
    let { children } = $props();
</script>

<article class="prose prose-green prose-code:before:content-none prose-code:after:content-none shadow-s mt-5 pl-2 pr-2 mb-5 w-full">
    {@render children()}
</article>

<style>
    @reference "tailwindcss";
    :global(.frac-line) {
        border-color: --tw-prose-body;
    }

    :global(.math-display) {
        @apply bg-(--tw-prose-pre-bg) rounded-md p-1 mb-2 m-0 overflow-auto shadow-md w-full;
    }

    :global(pre) {
        @apply overflow-auto w-full shadow-md;
    }
</style>
