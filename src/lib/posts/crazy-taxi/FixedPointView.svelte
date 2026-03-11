<script lang="ts">
    import { binstr, hexstr } from "./util";

    let { data, totalBits, signed }: {
        data: number[],
        totalBits: number,
        signed: boolean,
    } = $props();

    let n = $state(0);
    let signedBits = $derived(signed ? 1 : 0);
    let m = $derived(totalBits - n - signedBits);
    let q = $derived(`Q${m}.${n}`)

    function toFixedPoint(value: number): number {
        let bin = binstr(value, totalBits);
        let sign = 1;
        let integer = 0;
        let fraction = 0;
        if (signed) {
            sign = bin[0] === '1' ? -1 : 1;
        }
        if (sign === -1) {
            let newBin = '';
            for (let i=0; i<bin.length; i++) {
                newBin += bin[i] === '1' ? '0' : '1';
            }
            bin = newBin;
        }
        if (m > 0) {
            integer = parseInt(bin.slice(signedBits, m+signedBits), 2);
        }
        if (n > 0) {
            fraction = parseInt(bin.slice(m+signedBits, m+n+signedBits), 2);
            fraction /= Math.pow(2, n);
        }
        return sign * (integer + fraction);
    }

    function update(amt: number) {
        if (n + amt < 0 || n + amt > totalBits - signedBits) {
            return;
        }
        n += amt;
    }
    const buttonClass = "p-1 border bg-green-800";
    let intButtonClass = $derived(n == 0 ? '' : 'hover:bg-green-700');
    let fracButtonClass = $derived(n == totalBits - signedBits ? '' : 'hover:bg-green-700');
</script>

<div class="font-mono flex flex-col items-center p-3 border border-dashed rounded-md">
    <span>Fixed-point Calculator</span>
    <span>Q notation: {q}</span>
    <div class="flex flex-row items-center">
        <button class={`${buttonClass} ${intButtonClass} rounded-l-md`} onclick={() => update(-1)}>Integer bits: {m} (+)</button>
        <button class={`${buttonClass} ${fracButtonClass} rounded-r-md`} onclick={() => update(1)}>Fractional bits: {n} (+)</button>
    </div>
    <table class="mb-0">
        <thead>
            <tr>
                <th>Hex</th>
                <th>Binary</th>
                <th>Fixed-point {q}</th>
            </tr>
        </thead>
        <tbody>
            {#each data as value}
                <tr>
                    <td>0x{hexstr(value, Math.ceil(totalBits / 8))}</td>
                    <td>{binstr(value, totalBits)}</td>
                    <td>{toFixedPoint(value)}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
