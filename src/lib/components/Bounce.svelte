<script lang="ts">
let { text }: {
    text: string,
} = $props();
</script>

<span>
    <span class="sr-only">{text}</span>
    <span aria-hidden="true">
        {#each text as letter, i}
            <span class="bounce" style={`--delay:${i}`}>{letter}</span>
        {/each}
    </span>
</span>

<style>
.bounce {
    display: inline-block;
    animation-name: bounce;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-duration: 2s;
    animation-delay: calc(-.2s * var(--delay));
    white-space: pre;
}

@media (prefers-reduced-motion) {
    .bounce {
        display: inline-block;
    }
}

@keyframes bounce {
    0%, 100% {
        transform: none;
        animation-timing-function: cubic-bezier(.46,.04,.67,.98);
    }

    50% {
        transform: translateY(-10%);
        animation-timing-function: cubic-bezier(.46,.04,.67,.98);
    }
}
</style>
