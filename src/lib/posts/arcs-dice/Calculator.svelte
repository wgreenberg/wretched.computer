<script lang="ts">
    import { Dicetower, type Distribution } from "./dice";
	import DiceCount from "./DiceCount.svelte";
	import katex from 'katex';

	let { nAssaultInit = 0, nSkirmishInit = 0, nRaidInit = 0 }: {
	   nAssaultInit: number,
	   nSkirmishInit: number,
	   nRaidInit: number,
	} = $props();

    const tower = Dicetower.createArcsTower(0, 0, 0);

    let nAssault = $state(nAssaultInit);
    let nSkirmish = $state(nSkirmishInit);
    let nRaid = $state(nRaidInit);
    let formula = $state(tower.stringify('D', ['h', 's', 'b', 'n', 'k']));
    let idxHorizontal = $state(0);
    let idxVertical = $state(1);
    let distribution: Distribution | undefined = $state(undefined);
    let formulaElement: HTMLElement | undefined = $state(undefined);

    const SYMBOLS = [
        { name: 'Hit', icon: '/images/arcs-dice/symbol-hit.png' },
        { name: 'Self Hit', icon: '/images/arcs-dice/symbol-selfhit.png' },
        { name: 'Building Hit', icon: '/images/arcs-dice/symbol-buildinghit-white.png' },
        { name: 'Intercept', icon: '/images/arcs-dice/symbol-intercept.png' },
        { name: 'Key', icon: '/images/arcs-dice/symbol-key.png' },
    ];

    $effect(() => {
        tower.numDice[0] = nSkirmish;
        tower.numDice[1] = nAssault;
        tower.numDice[2] = nRaid;
        formula = tower.stringify('D', ['h', 's', 'b', 'n', 'k']);
        katex.render(formula, formulaElement!);
        distribution = tower.buildComparativeDistribution(idxVertical, idxHorizontal);
    })

    function easeOutExpo(x: number): number {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

     /**
     * we have to have every color in our source code for tailwind to actually
     * generate classes
     * bg-red-50
     * bg-red-100
     * bg-red-200
     * bg-red-300
     * bg-red-400
     * bg-red-500
     * bg-red-600
     * bg-red-700
     * bg-red-800
     * bg-red-900
     * bg-red-900
     * bg-red-950
    */
    function probabilityToColor(p: number): string {
        const base = 'red';
        const t = easeOutExpo(p);
        if (t < .05) {
            return `${base}-50`;
        } else {
            const n = Math.min(Math.round(10 * t) * 100, 950);
            return `${base}-${n}`
        }
    }

    function textColor(c: string): string {
        if (c === '') return '';
        const numberStr = c.split('-').pop();
        const number = parseInt(numberStr!);
        if (number < 500) {
            return `text-slate-900`;
        } else {
            return `text-slate-200`;
        }
    }
</script>

{#snippet probabilitySquare(content: string, color: string)}
    <div class="text-center overflow-clip rounded-md w-14 m-1 pt-2 bg-{color}">
        <span class="{textColor(color)}">{content}</span>
    </div>
{/snippet}

{#snippet headerSquare(idx: number, count: number)}
    {@const symbol = SYMBOLS[idx]}
    <div class="text-center overflow-clip rounded-md w-14 m-1 p-2">
        <span class="inline-flex">
            <span>{count}x</span>
            <img class="m-0" width=20 height=20 src={symbol.icon} alt={symbol.name} />
        </span>
    </div>
{/snippet}

<div class="flex flex-col p-2 border border-[--tw-prose-th-borders] rounded-md">
    <span><u>Dice pool:</u></span>
    <div class="ml-2">
        <DiceCount name="Skirmish" color="bg-blue-500" bind:count={nSkirmish} />
        <DiceCount name="Assault" color="bg-red-500" bind:count={nAssault} />
        <DiceCount name="Raid" color="bg-orange-500" bind:count={nRaid} />
    </div>
    <span><u>Generating function:</u></span>
    <div class="prose ml-2 prose-green bg-[--tw-prose-pre-bg] rounded-md p-2 m-0 shadow-md" bind:this={formulaElement}></div>
    <span><u>Symbols to compare:</u></span>
    <div class="ml-2 prose-green inline-flex space-x-1">
        <label for="a">Symbol 1</label>
        <select class="bg-slate-800" bind:value={idxHorizontal} name="a">
            {#each SYMBOLS as symbol, i}
                <option value={i}>{symbol.name}</option>
            {/each}
        </select>
        <img class="m-0" height=20 width=20 src={SYMBOLS[idxHorizontal].icon} alt={SYMBOLS[idxHorizontal].name} >
    </div>
    <div class="ml-2 inline-flex space-x-1 prose-green">
        <label for="b">Symbol 2</label>
        <select class="bg-slate-800" bind:value={idxVertical} name="b">
            {#each SYMBOLS as symbol, i}
                <option value={i}>{symbol.name}</option>
            {/each}
        </select>
        <img class="m-0" height=20 width=20 src={SYMBOLS[idxVertical].icon} alt={SYMBOLS[idxVertical].name} >
    </div>
    {#if distribution}
        <span><u>Outcome Distribution:</u></span>
        <div class="flex flex-row">
            <div class="w-12 m-1"></div>
            {#each {length: distribution.rangeB + 1}, i}
                {@render headerSquare(idxHorizontal, i)}
            {/each}
        </div>
        {#each distribution.probabilities as aProb, a}
            <div class="flex flex-row">
                {@render headerSquare(idxVertical, a)}
                {#each aProb as probability}
                    {@const percent = probability < 1.0 ? (probability * 100).toPrecision(2) + '%' : '100%'}
                    {@render probabilitySquare(percent, probabilityToColor(probability))}
                {/each}
            </div>
        {/each}
    {/if}
</div>
