<script lang="ts">
    import type { PageData } from "./$types";
    import PostCard from "$lib/components/PostCard.svelte";

    let { data }: { data: PageData } = $props();

    console.log(data.posts);
</script>

{#each data.posts as post}
    <PostCard {post} />
{/each}
