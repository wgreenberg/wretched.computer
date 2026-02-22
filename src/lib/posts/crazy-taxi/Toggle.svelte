<script lang="ts">
let { offLabel, onLabel, on = $bindable() }: {
    offLabel: string,
    onLabel: string,
    on: boolean
} = $props();

let selected = `bg-teal-800 pl-1 pr-1`;
let unselected = `pl-1 pr-1`;

let offClass = $derived(on ? unselected : selected);
let onClass = $derived(on ? selected : unselected);

function toggle() {
    on = !on;
}
</script>

<button onclick={toggle} class="group bg-gray-700 border border-gray-700 hover:border-teal-300 p-1 flex items-center">
    <span class="flex-1 w-0 {offClass}">{offLabel}</span>
    <span class="flex-1 w-0 {onClass}">{onLabel}</span>
</button>
