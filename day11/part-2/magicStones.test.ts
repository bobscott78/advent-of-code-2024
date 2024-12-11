import { describe, it, expect } from 'vitest';

describe('Magic Stones', () => {
  it('should apply all rules', async () => {
    let stones = [125, 17];
    let result = apply(stones, 6);
    expect(result).toBe(22);
  });
});

function apply(stones: number[], blinks: number): number {
  let stonesAsMap = new Map<number, number>();

  for (const stone of stones) {
    stonesAsMap.set(stone, (stonesAsMap.get(stone) ?? 0) + 1);
  }

  for (let blink = 0; blink < blinks; blink++) {
    const newRow = new Map<number, number>();
    const keys = Array.from(stonesAsMap.keys());
    for (const stone of keys) {
      const stonesWithThisValue = stonesAsMap.get(stone) ?? 0;
      stonesAsMap.delete(stone);

      const newStones = applyRules(stone);
      for (const newStone of newStones) {
        newRow.set(newStone, (newRow.get(newStone) ?? 0) + stonesWithThisValue);
      }
    }
    stonesAsMap = newRow;
  }
  return Array.from(stonesAsMap.values()).reduce((a, b) => a + b, 0);
}

function applyRules(stone: number) {
  const result = [];
  if (stone === 0) {
    result.push(1);
  } else if (stone.toString().length % 2 === 0) {
    const label = stone.toString();
    result.push(Number(label.slice(0, label.length / 2)));
    result.push(Number(label.slice(label.length / 2)));
  } else {
    result.push(stone * 2024);
  }
  return result;
}