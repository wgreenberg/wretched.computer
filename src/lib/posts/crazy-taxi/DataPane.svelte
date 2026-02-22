<script lang="ts">
	import Toggle from "./Toggle.svelte";

let { data, index, littleEndian=false }: {
    data: DataView,
    index?: number,
    littleEndian: boolean
} = $props();

let uint8 = $derived(index === undefined ? undefined : data.getUint8(index));
let uint16 = $derived(index === undefined ? undefined : data.getUint16(index, littleEndian));
let uint32 = $derived(index === undefined ? undefined : data.getUint32(index, littleEndian));
let int8 = $derived(index === undefined ? undefined : data.getInt8(index));
let int16 = $derived(index === undefined ? undefined : data.getInt16(index, littleEndian));
let int32 = $derived(index === undefined ? undefined : data.getInt32(index, littleEndian));
let float16 = $derived(index === undefined ? undefined : data.getFloat16(index, littleEndian));
let float32 = $derived(index === undefined ? undefined : data.getFloat32(index, littleEndian));

function presentValue(n: number | undefined, isFloat = false): string {
    if (n === undefined) {
        return '-';
    } else if (isFloat) {
        return `${n.toPrecision(4)}`;
    } else {
        return `${n}`;
    }
}

let cellPadding = `overflow-x-auto`;

let headerRow = `bg-gray-950 ${cellPadding}`;
let bitColumn = `pl-2 pt-2 bg-gray-900 ${cellPadding}`;
let data1 = `bg-gray-800 ${cellPadding}`;
let data2 = `bg-gray-700 ${cellPadding}`;

</script>

<div class="flex flex-col overflow-auto">
    <table class="table-fixed m-0">
        <thead>
            <tr>
                <th class={bitColumn}>Bits</th>
                <th class={headerRow}>uint</th>
                <th class={headerRow}>int</th>
                <th class={headerRow}>float</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class={bitColumn}>8</td>
                <td class={data1}>{presentValue(uint8)}</td>
                <td class={data2}>{presentValue(int8)}</td>
                <td class={data1}>-</td>
            </tr>
            <tr>
                <td class={bitColumn}>16</td>
                <td class={data1}>{presentValue(uint16)}</td>
                <td class={data2}>{presentValue(int16)}</td>
                <td class={data1}>{presentValue(float16, true)}</td>
            </tr>
            <tr>
                <td class={bitColumn}>32</td>
                <td class={data1}>{presentValue(uint32)}</td>
                <td class={data2}>{presentValue(int32)}</td>
                <td class={data1}>{presentValue(float32, true)}</td>
            </tr>
        </tbody>
    </table>
    <div class="flex flex-col mt-3 mb-1 max-w-32">
        <span>Endianness:</span>
        <Toggle bind:on={littleEndian} offLabel="Big" onLabel="Little" />
    </div>
</div>

<style>
</style>
