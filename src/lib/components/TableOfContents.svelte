<script lang="ts">
    let { headings }: { headings: App.Heading[] } = $props();
    let expanded = $state(false);

    function onclick(heading: App.Heading) {
        expanded = false;
        setTimeout(() => {
            // the ids are suffixed with "-1" for some reason??
            location.hash = heading.id.slice(0, heading.id.length - 2);
        }, 0);
    }
</script>

<div class="prose z-10 prose-green sticky -top-px flex flex-col bg-emerald-900 border-slate-400 border border-dashed border-t-0 m-0 rounded-b p-2 w-full">
    <button onclick={() => expanded = !expanded}>Table of Contents [{expanded ? '-' : '+'}]</button>
    {#if expanded}
        <ol class="list-inside border border-slate-500 bg-teal-900 overflow-scroll max-h-96 mt-0 ml-0">
        {#each headings as heading}
            <li><button onclick={() => onclick(heading)}>{heading.title}</button></li>
        {/each}
        </ol>
    {/if}
</div>

<style>
    :global(h2) {
        scroll-margin-top: 60px;
    }
</style>
