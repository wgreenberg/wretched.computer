<script lang="ts">
	import { SITE_CONFIG } from "$lib";
	import type { PostMetadata } from "../../routes/post/[slug]/+page";

    let { post }: { post: PostMetadata } = $props();
    let url = $derived(`${SITE_CONFIG.url}${post.path}`);

    function absoluteUrl(path: string): string {
        return `${SITE_CONFIG.url}${path}`;
    }
</script>

<svelte:head>
<meta property="og:title" content={post.title} />
<meta property="og:description" content={post.description} />
<meta property="og:type" content="article" />
{#if post.previewVideoUrl}
    <meta property="og:video" content={absoluteUrl(post.previewVideoUrl)} />
{:else}
    <meta property="og:image" content={absoluteUrl(post.previewImageUrl ? post.previewImageUrl : "/favicon.png")} />
{/if}
<meta property="og:url" content={url} />
</svelte:head>
