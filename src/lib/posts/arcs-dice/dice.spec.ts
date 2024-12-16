import { describe, expect, it } from "vitest";
import { CoefficientString, Dicetower, Die, MultiPolynomial } from "./dice";

describe('MultiPolynomial', () => {
    it('should pretty-print', () => {
        const f = new MultiPolynomial(2);
        const variables = ['x', 'y'];
        expect(f.stringify(variables)).toBe('0');
        f.addTerm(2, [0, 0]);
        expect(f.stringify(variables)).toBe('2');
        f.addTerm(3, [1, 0]);
        f.addTerm(1, [0, 1]);
        f.addTerm(5, [2, 1]);
        f.addTerm(0, [2, 2]);
        expect(f.stringify(variables)).toBe('2 + 3x + y + 5x^{2}y');
    });

    it('should evaluate', () => {
        const f = new MultiPolynomial(2);
        expect(f.evaluate([1n, 1n])).toBe(0n);
        f.addTerm(2, [0, 0]);
        expect(f.evaluate([1n, 1n])).toBe(2n);
        f.addTerm(3, [1, 0]);
        f.addTerm(4, [0, 1]);
        f.addTerm(5, [2, 1]);
        f.addTerm(0, [2, 2]);
        expect(f.evaluate([2n, 2n])).toBe(56n);
    })

    it('should know variable degrees', () => {
        const f = new MultiPolynomial(2);
        expect(f.degrees()).toEqual([0, 0]);
        f.addTerm(2, [0, 0]);
        expect(f.degrees()).toEqual([0, 0]);
        f.addTerm(3, [1, 0]);
        expect(f.degrees()).toEqual([1, 0]);
        f.addTerm(4, [0, 1]);
        expect(f.degrees()).toEqual([1, 1]);
        f.addTerm(5, [2, 1]);
        expect(f.degrees()).toEqual([2, 1]);
        f.addTerm(1, [2, 3]);
        expect(f.degrees()).toEqual([2, 3]);
        f.addTerm(1, [2, 2]);
        expect(f.degrees()).toEqual([2, 3]);
    })

    it('should calculate its max coefficient', () => {
        const f = new MultiPolynomial(2);
        expect(f.maxCoefficient()).toEqual(0);
        f.addTerm(2, [0, 0]);
        expect(f.maxCoefficient()).toEqual(2);
        f.addTerm(3, [1, 0]);
        expect(f.maxCoefficient()).toEqual(3);
        f.addTerm(4, [0, 1]);
        expect(f.maxCoefficient()).toEqual(4);
        f.addTerm(5, [2, 1]);
        expect(f.maxCoefficient()).toEqual(5);
    })
})

describe('Die', () => {
    it('should have the right arcs values', () => {
        const variableNames = ['h', 's', 'b', 'n', 'k'];
        expect(Die.createAssaultDie().p.stringify(variableNames)).toBe('1 + h^{2} + h^{2}s + hn + 2hs');
        expect(Die.createSkirmishDie().p.stringify(variableNames)).toBe(`3 + 3h`);
        expect(Die.createRaidDie().p.stringify(variableNames)).toBe('nk^{2} + hk + bk + 2hb + n');
    })
})

describe('CoefficientString', () => {
    it('should return queried coefficients', () => {
        const x = 100n;
        const y = 10000000n;
        let num = 18n;
        num += 13n * x;
        num += 12n * (x ** 2n);
        num += 7n * x * y;
        num += 9n * x * (y ** 2n);
        const string = new CoefficientString(100n, [x, y], num);
        expect(string.query([0n, 0n])).toBe(18n);
        expect(string.query([1n, 0n])).toBe(13n);
        expect(string.query([2n, 0n])).toBe(12n);
        expect(string.query([1n, 1n])).toBe(7n);
        expect(string.query([1n, 2n])).toBe(9n);
    })
})

describe('Dicetower', () => {
    it('should know its variable degrees', () => {
        const tower = new Dicetower(5);
        tower.addDice(Die.createAssaultDie(), 4);
        expect(tower.degrees()).toEqual([8, 4, 0, 4, 0]);
    })

    it('should properly evaluate', () => {
        const tower = new Dicetower(1);
        tower.addDice(Die.createStandardDie(6), 1);
        expect(tower.evaluate([10n])).toBe(1111110n);
        tower.addDice(Die.createStandardDie(6), 0);
        expect(tower.evaluate([10n])).toBe(1111110n);
    })

    it('should handle standard dice', () => {
        const tower = new Dicetower(1);
        tower.addDice(Die.createStandardDie(6), 2);
        const string = tower.calculateProbabilities();
        expect(string.query([0n])).toBe(0n);
        expect(string.query([1n])).toBe(0n);
        expect(string.query([2n])).toBe(1n);
        expect(string.query([3n])).toBe(2n);
        expect(string.query([4n])).toBe(3n);
        expect(string.query([5n])).toBe(4n);
        expect(string.query([6n])).toBe(5n);
        expect(string.query([7n])).toBe(6n);
        expect(string.query([8n])).toBe(5n);
        expect(string.query([9n])).toBe(4n);
        expect(string.query([10n])).toBe(3n);
        expect(string.query([11n])).toBe(2n);
        expect(string.query([12n])).toBe(1n);
        expect(string.query([13n])).toBe(0n);
    })

    it('should know the total number of outcomes', () => {
        const tower = new Dicetower(1);
        tower.addDice(Die.createStandardDie(6), 4);
        expect(tower.totalOutcomes()).toBe(6 ** 4);
        tower.addDice(Die.createStandardDie(4), 2);
        expect(tower.totalOutcomes()).toBe((6 ** 4) * (4 ** 2));
    })

    it('should stringify', () => {
        const tower = Dicetower.createArcsTower(1, 4, 0)
        expect(tower.stringify('D', ['h', 's', 'b', 'n', 'k'])).toBe("D(h, s, b, n, k) = \\dfrac{1}{7776}(3 + 3h)(1 + h^{2} + h^{2}s + hn + 2hs)^{4}");
    })

    it('calculates Arcs probability distribution', () => {
        const tower = new Dicetower(5);
        tower.addDice(Die.createAssaultDie(), 4);
        const string = tower.calculateProbabilities();
        expect(string.query([0n, 0n, 0n, 0n, 0n])).toBe(1n);
        expect(string.query([2n, 0n, 0n, 0n, 0n])).toBe(4n);
        expect(string.query([4n, 0n, 0n, 0n, 0n])).toBe(6n);
        expect(string.query([7n, 1n, 0n, 1n, 0n])).toBe(12n);
    })

    it('should compare two variables', () => {
        const tower = Dicetower.createArcsTower(1, 0, 0);
        console.log(tower.dice[0].p.evaluate([10n, 0n, 0n, 0n, 0n]));
        const dist = tower.buildComparativeDistribution(0, 1);
        let total = 0;
        for (let h = 0; h <= dist.rangeA; h++) {
            for (let s = 0; s <= dist.rangeB; s++) {
                console.log(`h=${h} and s=${s} => ${dist.probabilities[h][s] * 100}`)
                total += dist.probabilities[h][s];
            }
        }
        console.log(total * 100);
    })
})
