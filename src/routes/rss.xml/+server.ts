import { SITE_CONFIG } from '$lib/index'
import { getAbsolutePostUrl, getPosts, type Post } from '$lib/posts'

export async function GET({ fetch }) {
    const posts: Post[] = await getPosts();

    const headers = { 'Content-Type': 'application/xml' };
	const xml = `
		<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
			<channel>
				<title>${SITE_CONFIG.title}</title>
				<description>${SITE_CONFIG.description}</description>
				<link>${SITE_CONFIG.url}</link>
				<atom:link href="${SITE_CONFIG.url}/rss.xml" rel="self" type="application/rss+xml"/>
				${posts
				    .filter(post => post.published)
					.map(
						(post) => `
						<item>
							<title>${post.title}</title>
							<description>${post.description}</description>
							<link>${getAbsolutePostUrl(post)}</link>
							<guid isPermaLink="true">${getAbsolutePostUrl(post)}</guid>
							<pubDate>${new Date(post.date).toUTCString()}</pubDate>
						</item>
					`
					)
					.join('')}
			</channel>
		</rss>
	`.trim()

	return new Response(xml, { headers })
}
