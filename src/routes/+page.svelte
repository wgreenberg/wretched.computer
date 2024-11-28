<script lang="ts">
    import type { PageData } from "./$types";
    import PostCard from "$lib/components/PostCard.svelte";

    let { data }: { data: PageData } = $props();
</script>

<main class="flex items-center justify-stretch flex-col">
    <article class="prose prose-green w-4/5 text-center m-5 p-5">
        <h1>a terrible device</h1>
        <p>hi, I'm Will, a technologist at EFF with an interest in games, computer graphics, and math.</p>
    </article>
    <article class="prose prose-green shadow-md w-4/5 text-center m-5">
        <h2>Posts</h2>
        {#each data.posts as post}
            <PostCard {post} />
        {/each}
    </article>
</main>
