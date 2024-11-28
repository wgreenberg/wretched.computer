import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
    	container: {
    	   center: true,
    	},
		extend: {
		    typography: ({ theme }) => ({
				green: {
				    css: {
             			'--tw-prose-body': theme('colors.green[200]'),
                        '--tw-prose-headings': theme('colors.emerald[400]'),
                        '--tw-prose-lead': theme('colors.green[300]'),
                        '--tw-prose-links': theme('colors.lime[400]'),
                        '--tw-prose-bold': theme('colors.white'),
                        '--tw-prose-counters': theme('colors.green[400]'),
                        '--tw-prose-bullets': theme('colors.green[600]'),
                        '--tw-prose-hr': theme('colors.green[700]'),
                        '--tw-prose-quotes': theme('colors.green[100]'),
                        '--tw-prose-quote-borders': theme('colors.green[700]'),
                        '--tw-prose-captions': theme('colors.green[400]'),
                        '--tw-prose-code': theme('colors.white'),
                        '--tw-prose-pre-code': theme('colors.green[300]'),
                        '--tw-prose-pre-bg': 'rgb(0 0 0 / 50%)',
                        '--tw-prose-th-borders': theme('colors.green[600]'),
                        '--tw-prose-td-borders': theme('colors.green[700]'),
					}
				}
    	 	})
		}
	},

	plugins: [typography],
	darkMode: 'selector',
} satisfies Config;
