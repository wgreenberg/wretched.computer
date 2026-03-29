// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface MdsvexFile {
            default: import('svelte/internal').SvelteComponent;
            metadata: Record<string, string>;
		}

        interface Heading {
            level: number,
            title: string,
            id: string,
		}

        type MdsvexResolver = () => Promise<MdsvexFile>;
	}
}

export {};
