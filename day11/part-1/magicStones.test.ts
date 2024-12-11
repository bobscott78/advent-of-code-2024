import { describe, it, expect } from 'vitest';

describe('Magic Stones', () => {
  it('should apply all rules', async () => {
    let stones = [0, 1, 10, 99, 999];
    let result = new Rules().apply(stones);
    expect(result).toEqual([1, 2024, 1, 0, 9, 9, 2021976]);
  });

  it('should apply all rules after 5 blinks', async () => {
    let stones = [125, 17];
    let rules = new Rules();
    for (let i = 0; i < 5; i++) {
      stones = rules.apply(stones);
    }
    expect(stones).toEqual([1036288, 7, 2, 20, 24, 4048, 1, 4048, 8096, 28, 67, 60, 32]);
  });

  it('should cope with 25 blinks', async () => {
    let stones = [125, 17];
    let rules = new Rules();
    for (let i = 0; i < 25; i++) {
      stones = rules.apply(stones);
    }
    expect(stones).toHaveLength(55312);
  });
});

class Rules {
  apply(stones: number[]): number[] {
    const result = [];
    for (let i = 0; i < stones.length; i++) {
      if (stones[i] === 0) {
        result.push(1);
      } else if (stones[i].toString().length % 2 === 0) {
        const label = stones[i].toString();
        result.push(Number(label.slice(0, label.length / 2)));
        result.push(Number(label.slice(label.length / 2)));
      } else {
        result.push(stones[i] * 2024);
      }
    }
    return result;
  }
}
