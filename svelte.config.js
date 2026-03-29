import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import rehypeKatexSvelte from "rehype-katex-svelte";
import remarkMath from "remark-math";
import GithubSlugger from 'github-slugger';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const slugger = new GithubSlugger();

function getHeadings() {
  let visit;
  let tree_to_string;
  return async function transformer(tree, vFile) {
    if (!visit) {
      tree_to_string = (await import('mdast-util-to-string')).toString;
      visit = (await import('unist-util-visit')).visit;
    }

    vFile.data.headings = [];

    visit(tree, 'heading', (node) => {
      const title = tree_to_string(node);
      const id = slugger.slug(title);
      // if (node.data === undefined) {
      //   node.data = {};
      // }
      // node.data.id = id;
      // if (node.data.hProperties === undefined) {
      //   node.data.hProperties = {};
      // }
      // node.data.hProperties.id = id;
      vFile.data.headings.push({
        level: node.depth,
        title,
        id,
      });
    });

    if (!vFile.data.fm) vFile.data.fm = {};
    vFile.data.fm.headings = vFile.data.headings;
  };
}



/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
  preprocess: [vitePreprocess(), mdsvex({
    remarkPlugins: [
      remarkMath,
      getHeadings,
    ],
    rehypePlugins: [
      [rehypeKatexSvelte, {
        // output: 'mathml', // MathML seems to format worse??
      }],
      [rehypeSlug],
      [rehypeAutolinkHeadings],
    ]
	})],

	kit: {
		adapter: adapter({
		  fallback: null,
		})
	},

	extensions: ['.svelte', '.svx']
};

export default config;
