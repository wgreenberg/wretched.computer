import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import rehypeKatexSvelte from "rehype-katex-svelte";
import remarkMath from "remark-math";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex({
    remarkPlugins: [remarkMath],
 	  rehypePlugins: [[rehypeKatexSvelte, {
      // output: 'mathml', // MathML seems to format worse??
    }]]
	})],

	kit: {
		adapter: adapter({
		  fallback: null,
		})
	},

	extensions: ['.svelte', '.svx']
};

export default config;
