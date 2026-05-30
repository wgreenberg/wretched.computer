import { SITE_CONFIG } from "$lib";

export interface Post {
    slug: string;
    title: string;
    author: string;
    description: string;
    date: Date;
    published: boolean;
}

export function getAbsolutePostUrl(slug: string): string {
    return `${SITE_CONFIG.url}/${getPostPath(slug)}`;
}

export function getPostPath(slug: string): string {
    return `/post/${slug}`;
}

export async function getPosts(): Promise<Post[]> {
    const postModules = import.meta.glob('/src/posts/*.svx');
    const posts: Post[] =  await Promise.all(Object.entries(postModules).map(async ([path, resolver]) => {
        const slug = path.split('/').pop()!.split('.')[0];
        const post = (await resolver()) as App.MdsvexFile;
        return {
            slug,
            date: post.metadata.date as unknown as Date, // mdsvx is actually parsing this as a date already
            ...post.metadata,
        } as Post;
    }));

    posts.sort((a, b) => a.date > b.date ? -1 : 1);

    return posts;
}
