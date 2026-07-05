import { getPosts, type Post } from '$lib/posts'
import { generateRssXml } from '$lib/rss'
export const prerender = true;

export async function GET({ params }) {
    const posts: Post[] = (await getPosts()).filter(post => {
        if (!post.tags) return false;
        return post.tags.includes(params.tag);
    });

    const headers = { 'Content-Type': 'application/xml' };
    const path = `tags/${params.tag}/rss.xml`;
	return new Response(generateRssXml(posts, path), { headers })
}
