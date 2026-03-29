<script lang="ts">
    import MultiPartHeader from "$lib/components/MultiPartHeader.svelte";
    let { currentPart }: {
        currentPart: number,
    } = $props();

    const parts = [
        {
            title: "Part 1: Introduction & archive reversing",
            url: "/post/crazytaxi"
        },
        {
            title: "Part 2: Reversing shape files",
            url: "/post/crazytaxi2"
        },
    ]
</script>

<MultiPartHeader
    {parts}
    {currentPart}>
    <slot></slot>
</MultiPartHeader>
