<script lang="ts">
let { data, index, littleEndian }: {
    data: DataView,
    index?: number,
    littleEndian?: boolean
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

let color1 = `bg-gray-700 pl-1 pr-1`;
let color2 = `bg-gray-500 pl-1 pr-1`;

</script>

<div class="flex flex-col">
    <div class="flex flex-row font-mono prose-sm">
        <div class="flex flex-col">
            <span class={color1}>Bits</span>
            <span class={color2}>8</span>
            <span class={color1}>16</span>
            <span class={color2}>32</span>
        </div>
        <div class="flex flex-col">
            <span class={color2}>uint</span>
            <span class={color1}>{presentValue(uint8)}</span>
            <span class={color2}>{presentValue(uint16)}</span>
            <span class={color1}>{presentValue(uint32)}</span>
        </div>
        <div class="flex flex-col">
            <span class={color1}>int</span>
            <span class={color2}>{presentValue(int8)}</span>
            <span class={color1}>{presentValue(int16)}</span>
            <span class={color2}>{presentValue(int32)}</span>
        </div>
        <div class="flex flex-col">
            <span class={color2}>float</span>
            <span class={color1}>-</span>
            <span class={color2}>{presentValue(float16, true)}</span>
            <span class={color1}>{presentValue(float32, true)}</span>
        </div>
    </div>
    <div class="mt-3">
        <span>Endianness:</span>
        <div class="inline-flex items-center">
            <label for="switch-component-on" class="text-sm cursor-pointer">Big</label>
            <div class="relative inline-block w-11 h-5 ml-1 mr-1">
                <input bind:checked={littleEndian} id="switch-component-on" type="checkbox" class="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300" />
                <label for="switch-component-on" class="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer">
                </label>
            </div>
            <label for="switch-component-on" class="text-sm cursor-pointer">Little</label>
        </div>
    </div>
</div>

<style>
</style>
