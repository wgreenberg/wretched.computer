import { getPostPath } from '$lib/posts';
import type { PageLoad } from './$types';

export interface PostMetadata {
    title: string;
    description: string;
    path: string;
    date: string;
    published: boolean;
    toc: boolean;
    previewImageUrl?: string;
    previewVideoUrl?: string;
}

function dateToString(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('en-us', {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function assertExists<T>(x: T | undefined): T {
    if (x === undefined) {
        throw new Error(`missing key`);
    }
    return x;
}

export const load: PageLoad = async ({ params }) => {
    const post = await import(`../../../posts/${params.slug}.svx`) as App.MdsvexFile;
    const headings = post.metadata.headings as unknown as App.Heading[];
    const content = post.default;

    const metadata: PostMetadata = {
        title: assertExists(post.metadata.title),
        description: assertExists(post.metadata.description),
        date: dateToString(assertExists(post.metadata.date)),
        path: getPostPath(params.slug),
        published: post.metadata.published === undefined ? false : !!post.metadata.published,
        toc: post.metadata.toc === undefined ? false : !!post.metadata.toc,
        previewImageUrl: post.metadata.previewImageUrl,
        previewVideoUrl: post.metadata.previewVideoUrl,
    };

    return {
        content,
        headings,
        metadata
    };
}
