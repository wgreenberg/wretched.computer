import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const post = await import(`../../../posts/${params.slug}.svx`) as App.MdsvexFile;
    const metadata = post.metadata;
    const headings = post.metadata.headings as unknown as App.Heading[];
    const content = post.default;

    return {
        content,
        headings,
        metadata
    };
}
