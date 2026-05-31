<script lang="ts">
    import type { PageData } from "./$types";
    import PostCard from "$lib/components/PostCard.svelte";
	import TitleBox from "$lib/components/TitleBox.svelte";
	import MainBox from "$lib/components/MainBox.svelte";
	import Bounce from "$lib/components/Bounce.svelte";
	import { SITE_CONFIG } from "$lib/index";

    let { data }: { data: PageData } = $props();
</script>

<svelte:head>
    <title>{SITE_CONFIG.title}</title>
    <meta property="og:title" content={SITE_CONFIG.title} />
    <meta property="og:description" content={SITE_CONFIG.description} />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="{SITE_CONFIG.url}/favicon.png" />
    <meta property="og:url" content={SITE_CONFIG.url} />
</svelte:head>
<main class="flex items-center justify-stretch flex-col">
    <TitleBox>
        <h1 class="font-serif">{SITE_CONFIG.title}</h1>
        <Bounce text={"hello traveler"} />
        <h4 class="text-center w-4/5">{SITE_CONFIG.description}</h4>
    </TitleBox>
    <MainBox>
        <h2>Posts</h2>
        <table class="table">
            <tbody>
                {#each data.posts as post}
                    <PostCard {post} />
                {/each}
            </tbody>
        </table>
    </MainBox>
    <MainBox>
        <h2 class="mb-2">Other Stuff</h2>
        <ul>
            <li><a href="/livesky"><span>livesky - sip the bluesky firehose</span></a></li>
        </ul>
    </MainBox>
</main>
