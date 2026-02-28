<script lang="ts">
	import { getPostPath, type Post } from "$lib/posts";

    let { post }: { post: Post } = $props();
    let hidden = post.published ? "" : "hidden"
</script>

<tr class={`${hidden}`}>
    <td class="align-middle">{post.date}</td>
    <td class="flex flex-col">
        <a href={getPostPath(post)}><span>{post.title}</span></a>
        <span class="overflow-ellipsis">{post.description}</span>
    </td>
</tr>
