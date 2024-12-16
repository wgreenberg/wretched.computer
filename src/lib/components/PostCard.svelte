<script lang="ts">
	import { getPostPath, type Post } from "$lib/posts";

    let { post }: { post: Post } = $props();
</script>

<div class="flex flex-row space-x-2">
    <span>{post.date}</span>
    <div>
        <a href={getPostPath(post)}><span>{post.title}</span></a>
        <span class="overflow-ellipsis">{post.description}</span>
    </div>
</div>
