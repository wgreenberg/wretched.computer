<script lang="ts">
    let { children } = $props();
</script>

<article class="prose prose-green border text-center border-slate-400 w-full bg-slate-800 shadow-s mt-5 p-5 overflow-auto">
    {@render children()}
</article>
