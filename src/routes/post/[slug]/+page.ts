import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const post = await import(`../../../posts/${params.slug}.svx`) as App.MdsvexFile;
    const metadata = post.metadata;
    const content = post.default;

    return {
        content,
        metadata
    };
}
