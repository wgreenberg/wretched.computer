import { SITE_CONFIG } from '$lib/index'
import { getAbsolutePostUrl, type Post } from '$lib/posts'

export function generateRssXml(posts: Post[], path: string): string {
    return `
		<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
			<channel>
				<title>wretched.computer</title>
				<description>${SITE_CONFIG.description}</description>
				<link>${SITE_CONFIG.url}</link>
				<atom:link href="${SITE_CONFIG.url}/${path}" rel="self" type="application/rss+xml"/>
				${posts
				    .filter(post => post.published)
					.map(
						(post) => `
						<item>
							<title>${post.title}</title>
							<description>${post.description}</description>
							<link>${getAbsolutePostUrl(post.slug)}</link>
							<guid isPermaLink="true">${getAbsolutePostUrl(post.slug)}</guid>
							<pubDate>${new Date(post.date).toUTCString()}</pubDate>
						</item>
					`
					)
					.join('')}
			</channel>
		</rss>
	`.trim()
}
