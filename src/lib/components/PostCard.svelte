<script lang="ts">
	import { getPostPath, type Post } from "$lib/posts";

    let { post }: { post: Post } = $props();
</script>

<div>
    <span>{post.title}</span>
    <a href={getPostPath(post)}>Read more</a>
</div>
