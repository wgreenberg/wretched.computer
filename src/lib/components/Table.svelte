<script lang="ts">
    let { header, rows, options, caption }: {
        header: unknown[] | undefined,
        rows: unknown[][],
        caption?: string,
        options?: {
            firstColumnHeader?: boolean,
        },
    } = $props();

    if (!options) {
        options = {};
    }
</script>

{#snippet element(e: unknown)}
    {#if typeof e === 'string' && e.startsWith('<') && e.endsWith('>')}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html e}
    {:else}
        {e}
    {/if}
{/snippet}

<div class="pt-2 flex flex-col items-center border border-[--tw-prose-th-borders]">
    <table class="table-auto self-center w-3/4">
        {#if caption}
            <caption class="mt-5 mb-0 caption-bottom">
                {caption}
            </caption>
        {/if}
        {#if header}
            <thead>
                <tr>
                {#each header as headerElement}
                    <th class="">{@render element(headerElement)}</th>
                {/each}
                </tr>
            </thead>
        {/if}
        <tbody>
            {#each rows as row}
                <tr>
                    {#each row as rowElement, index}
                        {#if options.firstColumnHeader && index == 0}
                            <th class="border-r-[1px] text-[--tw-prose-headings] border-r-[--tw-prose-th-borders]">{@render element(rowElement)}</th>
                        {:else}
                            <td>{@render element(rowElement)}</td>
                        {/if}
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
