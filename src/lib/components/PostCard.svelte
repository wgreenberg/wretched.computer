<script lang="ts">
	import { getPostPath, type Post } from "$lib/posts";

    let { post }: { post: Post } = $props();
</script>

<div>
    <a href={getPostPath(post)}><span>{post.title}</span></a>
    <span>{post.date}</span>
</div>
