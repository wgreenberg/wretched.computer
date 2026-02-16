<script lang="ts">
let { data, isHighlighted }: {
    data: number,
    isHighlighted: boolean,
} = $props();

let dataStr = $derived(data.toString(16));
let bgColor = $derived(isHighlighted ? 'bg-red-800' : '');
let textColor = $derived(data === 0 ? 'text-gray-400' : 'text-white');
let cssClass = $derived(`p-0.5 ${bgColor} ${textColor}`);
</script>

<span class={cssClass}>
    { dataStr.length === 1 ? `0${dataStr}` : dataStr }
</span>

<style>
</style>
