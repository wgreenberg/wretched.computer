import type { Meta, StoryObj } from '@storybook/svelte';

import Hype from './Hype.svelte';

const meta: Meta<typeof Hype> = {
  component: Hype,
};
export const Primary: StoryObj<typeof Hype> = {
    args: {
        primary: true,
        label: 'lol',
    },
};

export default meta;
