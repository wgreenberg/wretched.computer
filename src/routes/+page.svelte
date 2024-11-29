<script lang="ts">
    import type { PageData } from "./$types";
    import PostCard from "$lib/components/PostCard.svelte";
	import TitleBox from "$lib/components/TitleBox.svelte";
	import MainBox from "$lib/components/MainBox.svelte";

    let { data }: { data: PageData } = $props();
</script>

<main class="flex items-center justify-stretch flex-col">
    <TitleBox>
        <h1>a terrible device</h1>
        <p>hello traveler, I'm Will, a technologist at EFF with an interest in games, computer graphics, and math.</p>
    </TitleBox>
    <MainBox>
        <h2>Posts</h2>
        {#each data.posts as post}
            <PostCard {post} />
        {/each}
    </MainBox>
</main>
