<script lang="ts">
    let { children } = $props();
</script>

<aside class="border border-double rounded-md font-light px-3 m-4 md:ml-10 md:mr-10">
    {@render children()}
</aside>
