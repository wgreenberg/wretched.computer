<script lang="ts">
    import type { PageData } from "./$types";
    import PostCard from "$lib/components/PostCard.svelte";
	import TitleBox from "$lib/components/TitleBox.svelte";
	import MainBox from "$lib/components/MainBox.svelte";
	import Bounce from "$lib/components/Bounce.svelte";

    let { data }: { data: PageData } = $props();
</script>

<main class="flex items-center justify-stretch flex-col">
    <TitleBox>
        <h1>a terrible device</h1>
        <Bounce text={"hello traveler"} />
        <p>i'm Will, and this is a lil website where i write about math, computer graphics, and perhaps even other things</p>
    </TitleBox>
    <MainBox>
        <h2>Posts</h2>
        {#each data.posts as post}
            <PostCard {post} />
        {/each}
    </MainBox>
    <MainBox>
        <h2 class="mb-2">Other Stuff</h2>
        <ul>
            <li><a href="/livesky"><span>livesky - sip the bluesky firehose</span></a></li>
        </ul>
    </MainBox>
</main>
