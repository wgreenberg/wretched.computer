export function hexstr(n: number, nBytes: number): string {
    return numstr(n, 16, nBytes * 2);
}

export function binstr(n: number, nBits: number): string {
    return numstr(n, 2, nBits);
}

function numstr(n: number, radix: number, zeroPad: number): string {
    let result = n.toString(radix);
    while (result.length < zeroPad) {
        result = '0' + result;
    }
    return result;
}
