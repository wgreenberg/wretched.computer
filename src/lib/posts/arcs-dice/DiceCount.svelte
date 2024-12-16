<script lang="ts">
    let { name, color, count = $bindable() }: {
        name: string,
        color: string,
        count: number,
    } = $props();

    function increase() { count++; }
    function decrease() { count--; }
</script>

<div class="flex flex-row text-center">
    <button class="rounded-md m-1 p-1 w-20 h-10 {color}" onclick={increase}>{name}</button>
    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
    {#each {length: count} as i}
        <button class="rounded-md m-1 p-2 w-10 h-10 {color}" onclick={decrease}>{name[0]}</button>
    {/each}
</div>
