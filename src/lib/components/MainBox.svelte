<script lang="ts">
    let { children } = $props();
</script>

<article class="prose prose-green shadow-s mt-5 pl-2 pr-2 mb-5 w-full">
    {@render children()}
</article>
