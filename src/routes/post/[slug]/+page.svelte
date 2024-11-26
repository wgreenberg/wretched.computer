<script lang="ts">
	import type { PageData } from "./$types";
    let { data }: { data: PageData } = $props();
</script>

<article class="prose">
    <h1>{data.metadata.title}</h1>
    <h2>{data.metadata.date}</h2>
    {@render data.content()}
</article>
