import { getPosts, type Post } from '$lib/posts'
import { generateRssXml } from '$lib/rss'
export const prerender = true;

export async function GET({ fetch }) {
    const posts: Post[] = await getPosts();

    const headers = { 'Content-Type': 'application/xml' };
	return new Response(generateRssXml(posts, "rss.xml"), { headers })
}
