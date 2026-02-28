<script lang="ts">
    let { children } = $props();
</script>

<article class="prose prose-green flex flex-col items-center border border-dashed rounded-lg lg:border-slate-400 border-b w-full shadow-s md:p-5 p-1 ml-1 mr-1 overflow-auto">
    {@render children()}
</article>
