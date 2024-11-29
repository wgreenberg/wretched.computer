<script lang="ts">
    export interface Effects {
        bounce: boolean,
        rainbow: boolean,
    };

    let { text }: {
        text: string,
        effects: Effects,
    } = $props();

    let effectElement = document.createElement('span');

    for (const letter of text) {
        const letterElement = document.createElement('span');
        letterElement.setAttribute('aria-hidden', 'true');
        letterElement.classList.add('bounce')
        letterElement.style.animationDelay = '10';
        letterElement.innerText = letter;
        effectElement.appendChild(letterElement);
    }
</script>

<span>
    <span class="sr-only">{text}</span>
    <span bind:this={effectElement}></span>
</span>

<style>
    .bounce {
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-name: bounce;
        animation-timing-function: linear;
    }
</style>
