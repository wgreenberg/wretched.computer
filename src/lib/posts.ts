
export interface Post {
    slug: string;
    title: string;
    author: string;
    description: string;
    date: string;
    published: boolean;
}

export function getPostPath(post: Post): string {
    return `/post/${post.slug}`;
}

export async function getPosts(): Promise<Post[]> {
    const postModules = import.meta.glob('/src/posts/*.svx');
    const posts: Post[] =  await Promise.all(Object.entries(postModules).map(async ([path, resolver]) => {
        const slug = path.split('/').pop()!.split('.')[0];
        const post = (await resolver()) as App.MdsvexFile;
        return {
            slug,
            ...post.metadata,
        } as Post;
    }));

    const publishedPosts = posts.filter(post => post.published);
    publishedPosts.sort((a, b) => (new Date(a.date)) > (new Date(b.date)) ? -1 : 1);

    return publishedPosts;
}
