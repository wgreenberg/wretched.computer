
export class MultiPolynomialTerm {
    public numVariables: number;
    public degrees: bigint[];
    public coeff: bigint;

    constructor(coeff: number, degrees: number[]) {
        this.coeff = BigInt(coeff);
        this.degrees = degrees.map(d => BigInt(d));
        this.numVariables = degrees.length;
    }

    public stringify(variableNames: string[]): string | undefined {
        if (this.coeff === 0n) {
            return undefined;
        }
        const variables = this.degrees
            .map((d, i) => {
                if (d === 0n) return undefined;
                if (d === 1n)  return variableNames[i];
                return `${variableNames[i]}^{${d}}`
            })
            .filter(variable => variable !== undefined);
        if (variables.length === 0) {
            return `${this.coeff}`;
        } else if (this.coeff === 1n) {
            return `${variables.join('')}`;
        }
        return `${this.coeff}${variables.join('')}`;
    }

    public evaluate(variableValues: bigint[]): bigint {
        if (variableValues.length !== this.numVariables) {
            throw new Error(`cannot evaluate term with ${this.numVariables} on ${variableValues.length} values`);
        }
        return this.coeff * this.degrees.reduce((product, d, i) => product * variableValues[i] ** d, 1n);
    }
}

export class MultiPolynomial {
    public terms: MultiPolynomialTerm[] = [];

    constructor(public numVariables: number) {
    }

    public addTerm(coeff: number, degrees: number[]) {
        const term = new MultiPolynomialTerm(coeff, degrees);
        if (term.numVariables !== this.numVariables) {
            throw new Error(`expected term with ${this.numVariables}, but got one with ${term.numVariables}`);
        }
        this.terms.push(term);
    }

    public evaluate(variableValues: bigint[]): bigint {
        return this.terms.reduce((total, term) => total + term.evaluate(variableValues), 0n);
    }

    public degrees(): number[] {
        const maxDegrees = new Array(this.numVariables).fill(0);
        for (const term of this.terms) {
            for (let i = 0; i < this.numVariables; i++) {
                if (term.degrees[i] > maxDegrees[i]) {
                    maxDegrees[i] = Number(term.degrees[i]);
                }
            }
        }
        return maxDegrees;
    }

    public maxCoefficient(): number {
        return Number(this.terms.reduce((max, term) => term.coeff > max ? term.coeff : max, 0n));
    }

    public stringify(variableNames: string[]): string {
        if (this.terms.length === 0) {
            return `0`;
        }
        const terms = this.terms
            .map(term => term.stringify(variableNames))
            .filter(term => term !== undefined);
        return `${terms.join(' + ')}`;
    }
}

export class Die {
    constructor(public p: MultiPolynomial, public numFaces: number) {
    }

    static createStandardDie(numSides: number): Die {
        const p = new MultiPolynomial(1);
        for (let i = 1; i <= numSides; i++) {
            p.addTerm(1, [i]);
        }
        return new Die(p, numSides);
    }

    static createAssaultDie(): Die {
        const p = new MultiPolynomial(5);
        p.addTerm(1, [0, 0, 0, 0, 0]);
        p.addTerm(1, [2, 0, 0, 0, 0]);
        p.addTerm(1, [2, 1, 0, 0, 0]);
        p.addTerm(1, [1, 0, 0, 1, 0]);
        p.addTerm(2, [1, 1, 0, 0, 0]);
        return new Die(p, 6);
    }

    static createSkirmishDie(): Die {
        const p = new MultiPolynomial(5);
        p.addTerm(3, [0, 0, 0, 0, 0]);
        p.addTerm(3, [1, 0, 0, 0, 0]);
        return new Die(p, 6);
    }

    static createRaidDie(): Die {
        const p = new MultiPolynomial(5);
        p.addTerm(1, [0, 0, 0, 1, 2]);
        p.addTerm(1, [1, 0, 0, 0, 1]);
        p.addTerm(1, [0, 0, 1, 0, 1]);
        p.addTerm(2, [1, 0, 1, 0, 0]);
        p.addTerm(1, [0, 0, 0, 1, 0]);
        return new Die(p, 6);
    }
}

export class CoefficientString {
    constructor(public base: bigint, public basis: bigint[], public n: bigint) {
    }

    public query(basisVec: bigint[]): bigint {
        const shift = this.basis.reduce((total, n, i) => total * n ** basisVec[i], 1n);
        return (this.n / shift) % this.base;
    }
}

export class Dicetower {
    public dice: Die[] = [];
    public numDice: number[] = [];

    constructor(public numVariables: number) {
    }

    public static createArcsTower(nSkirmish: number, nAssault: number, nRaid: number): Dicetower {
        const tower = new Dicetower(5);
        tower.addDice(Die.createSkirmishDie(), nSkirmish);
        tower.addDice(Die.createAssaultDie(), nAssault);
        tower.addDice(Die.createRaidDie(), nRaid);
        return tower;
    }

    public addDice(die: Die, n: number) {
        if (die.p.numVariables !== this.numVariables) {
            throw new Error(`die has ${die.p.numVariables} variables, but this Dicetower has ${this.numVariables}`);
        }
        this.dice.push(die);
        this.numDice.push(n);
    }

    public degrees(): number[] {
        return this.dice.reduce((degrees, die, i) => {
            const dieDegrees = die.p.degrees();
            const numDice = Number(this.numDice[i]);
            for (let j = 0; j < dieDegrees.length; j++) {
                degrees[j] += numDice * dieDegrees[j];
            }
            return degrees;
        }, new Array(this.numVariables).fill(0));
    }

    public evaluate(variableValues: bigint[]): bigint {
        if (variableValues.length !== this.numVariables) {
            throw new Error(`got incorrect number of values: ${variableValues.length} != ${this.numVariables}`);
        }
        return this.dice.reduce((total, die, i) => total * die.p.evaluate(variableValues) ** BigInt(this.numDice[i]), 1n);
    }

    public totalOutcomes(): number {
        // the total number of possible outcomes is the product of each die's total possible outcomes, which is just the numFaces ^ numDice
        return this.numDice.reduce((total, n, i) => total * (this.dice[i].numFaces ** n), 1);
    }

    public calculateProbabilities(isolateVariables?: boolean[]) {
        // since we know the result PGF's coefficients add up to the total
        // number of outcomes, an easy upper bound for the max coefficient is
        // just that
        const maxCoefficient = this.totalOutcomes();
        // the base we'll use is the next highest power of 10 greater than
        // maxCoefficient
        const baseExp = BigInt(Math.ceil(Math.log10(maxCoefficient + 1)));
        const base = 10n ** baseExp;
        // calculate the values we'll be evaluating our variables at. these need
        // to be powers of 10 whose orders of magnitude differ by large enough
        // quantities that no monomial will evaluate to the same power of 10
        let prevExp = 0n;
        let prevDegree = 0n;
        const values = this.degrees().map((d, i) => {
            if (d === 0) {
                return 0n;
            }
            if (isolateVariables && !isolateVariables[i]) {
                return 1n;
            }
            const newBase = base ** (prevDegree * prevExp + 1n)
            prevDegree = BigInt(d);
            prevExp = (prevDegree * prevExp + 1n);
            return newBase;
        });

        return new CoefficientString(base, values, this.evaluate(values));
    }

    public stringify(name: string, variableNames: string[]): string {
        const lhs = `${name}(${variableNames.join(', ')})`;
        const outcomes = this.totalOutcomes();
        if (outcomes === 1) {
            return `${lhs} = 1`;
        }
        const terms = this.dice
            .map((d, i) => {
                const numDice = this.numDice[i];
                if (numDice === 0) return;
                let term = `(${d.p.stringify(variableNames)})`;
                if (this.numDice[i] > 1) term += `^${numDice}`;
                return term;
            })
            .filter(term => term !== undefined)
            .join('');
        const scalingFactor = `\\dfrac{1}{${outcomes}}`;
        return `${lhs} = ${scalingFactor}${terms}`;
    }

    public buildComparativeDistribution(idxA: number, idxB: number): Distribution {
        const isolateVariables = new Array(this.numVariables).fill(false);
        isolateVariables[idxA] = isolateVariables[idxB] = true;
        const coefficients = this.calculateProbabilities(isolateVariables);
        const degrees = this.degrees();
        const degA = degrees[idxA];
        const degB = degrees[idxB];

        const totalOutcomes = this.totalOutcomes();
        const A = [];
        for (let a = 0; a <= degA; a++) {
            const B = [];
            for (let b = 0; b <= degB; b++) {
                const basis = new Array(this.numVariables).fill(0n);
                basis[idxA] = BigInt(a);
                basis[idxB] = BigInt(b);
                const probability = Number(coefficients.query(basis)) / totalOutcomes;
                B.push(probability)
            }
            A.push(B);
        }

        return {
            rangeA: degA,
            rangeB: degB,
            probabilities: A,
        }
    }
}

export interface Distribution {
    rangeA: number;
    rangeB: number;
    probabilities: number[][];
}
